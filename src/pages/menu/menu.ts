import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, AlertButton, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootMenuPage: string = 'SearchAttendantsPage';
  venueDetails: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
    public alrtCtrl: AlertController,
    private db: DatabaseProvider,
    private events: Events
  ) {
    this.getEventDetails();
  }

  ionViewDidLoad() {
    this.global.cLog('ionViewDidLoad MenuPage');
  }

  ionViewDidEnter() {
    this.global.cLog('ionViewDidEnter MenuPage');
    // this.events.publish('ionViewDidEnter-MenuPage');
  }

  getEventDetails() {
    this.db.get('event-selected').then(res => {
      this.global.cLog(`getEventDetails's data `, res);
      this.venueDetails.eventName = res.name;
      if (res.latitude && res.longitude) {
        this.getAddress(res.latitude, res.longitude);
      }

    }).catch(err => {
      this.global.cLog(`getEventDetails's error `, err);
    });
  }

  getAddress(lat, long) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCnQnyEfpKqea6KVev1LqFq8iZ6jUTaw6M`
    this.global.getRequest(url)
      .subscribe(res => {
        this.global.cLog('address response', res);
        this.venueDetails.address = res.results[0].formatted_address;
      }, err => {
        this.global.cLog('address error', err);
      });
  }

  scanQRCode() {
    this.global.cLog('clicked scanQRCode');
    this.navCtrl.push('ScanQrCodePage', { data: null });
  }

  syncToServer() {
    this.global.cLog('clicked syncToServer');
    this.bulkUpdate();
    // this.showAlert(`Server Message`, `Synchronization successfull`);
    // this.navCtrl.push('SearchAttendantsPage', {data: null});    
  }

  cleanEventData() {
    this.global.cLog('clicked cleanEventData');
    this.showAlert(this.global.warningText, this.global.TheInformationNot, () => {
      this.global.cLog('Clearing event log data');
      this.db.remove('users').then(res => {
        this.db.remove('event-selected').then(res => {
          this.global.showMessage(this.global.DataClearedSuccessfully);
        });
      });
      this.app.getRootNav().setRoot('SelectActiveEventPage', { data: null });
    });

  }

  changeEvent() {
    this.global.cLog('clicked changeEvent');
    this.app.getRootNav().setRoot('SelectActiveEventPage', { data: null });
  }

  settings() {
    this.global.cLog('clicked settings');
    this.navCtrl.push('SettingsPage', { data: null });
  }

  signout() {
    this.global.cLog('clicked signout');

    localStorage.removeItem('login-response');
    this.db.remove('login-response').then(res => { this.global.cLog(`successfully removed `) });
    this.db.remove('event-selected').then(res => { this.global.cLog(`successfully removed event-selected`) });
    this.db.remove('users').then(res => { this.global.cLog(`successfully removed event-selected`) });
    this.global.user_credentials = null;

    this.app.getRootNav().setRoot('LoginPage');
  }

  showAlert(title: string, subTitle: string, ok_callback?: Function) {
    let buttons: AlertButton[] = [{
      text: this.global.okay,
      handler: () => {
        this.global.cLog('OK pressed');

        if (ok_callback) {
          ok_callback();
        }

        alert.dismiss();
      }
    }];

    if (ok_callback) {
      buttons.push({
        text: this.global.cancel,
        role: 'cancel'
      });
    }

    let alert = this.alrtCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: buttons,
      enableBackdropDismiss: true,
    });
    alert.present();
  }

  bulkUpdate() {
    this.db.get('users').then((_users: any[]) => {

      this.global.cLog(`users from db are`, _users);

      let data = _users.filter(_u => _u.checked && !_u.synced);
      // let data = _users.slice(0, 10);

      this.global.cLog(`data to be posted is`, data);

      if (data.length > 0) {
        this.global.putRequest(this.global.base_path + 'api/v1/attendees', data)
          .subscribe(
            res => {

              this.global.isTokenExpire = false;

              this.global.cLog(`in bulkUpdate and the response is `, res);
              _users.forEach((element, i) => {
                _users[i].checked = true;
                _users[i].synced = true;
              });

              this.db.create('users', _users).then(res => {
                this.showAlert(this.global.ServerMessage, this.global.SynchronizationSuccessfull);
                this.events.publish('ionViewDidEnter-MenuPage');
              });

            }, err => {
              this.global.cLog(`some error in bulkUpdate `, err);
              this.showAlert(this.global.Error, this.global.ThereHasBeenErrorsTryingToSync);
              this.global.showMessage(err.error);
              this.events.publish('basepat-changed', { key: "From menu bulk update", value: true });
            }
          )
      } else {
        this.showAlert(this.global.Alert, this.global.NoUserToSync);
      }
    });
  }

  enterPlayerId(){
    this.global.cLog(`in enterPlayerId's method`);
    let alert = this.alrtCtrl.create({
      title: this.global.enterPlayerManually,
      inputs: [{
        type: 'input',
        placeholder: this.global.enterPlayerID,
      }],
      buttons: [
        {
          text: this.global.cancel,
          role: 'cancel'
        },
        {
          text: this.global.done,
          handler: (val) => {
            this.global.cLog(`in change basepath and the new basepath is `, val, val["0"]);
            this.checkForUserPresentLocally(val["0"]);
          }
        }],
    });

    alert.present();
  }

  checkForUserPresentLocally(id: string) {
    this.db.get('users').then((res: any[]) => {
      this.global.cLog(`Got the users, now updating the time`, res);

      if (res.length > 0) {
        let user = res.find((user) => {
          return user.id == id;
        });

        if (user) {
          this.global.cLog(`User found `, user, ` now updating checked_in_time`);

          res[res.indexOf(user)].checked_in_at = (new Date()).toISOString();
          res[res.indexOf(user)].checked = true;
          res[res.indexOf(user)].synced = false;
          res[res.indexOf(user)].isToday = true;
          // res[res.indexOf(user)].isToday = new Date().setHours(0, 0, 0, 0) == new Date(res[res.indexOf(user)].checked_in_at).setHours(0, 0, 0, 0);

          this.db.create('users', res)
            .then(update => {
              this.global.cLog(`Users updated successfully`, update);
              this.navCtrl.push('AttendantDetailPage', { data: user });
            }).catch(err => {
              this.global.cLog(`Users updated error`, err);
              this.navCtrl.push('AttendantDetailPage', { data: null });
            });
        } else {
          this.navCtrl.push('AttendantDetailPage', { data: null });
        }
      }
    });
  }
}
