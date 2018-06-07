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
    public alertCtrl: AlertController,
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
    this.events.publish('ionViewDidEnter-MenuPage');
  }

  getEventDetails() {
    this.db.get('event-selected').then(res => {
      this.global.cLog(`getEventDetails's data `, res);
      this.venueDetails.eventName = res.venue_name;
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
    this.showAlert(`Warning`, `The information not sent will be lost. Are you sure?`, () => {
      this.global.cLog('Clearing event log data');
      this.db.remove('users').then(res => {
        this.db.remove('event-selected').then(res => {
          this.global.showMessage(`Data Cleared Successfully`);
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
    this.db.clear();
    this.app.getRootNav().setRoot('LoginPage');
  }

  showAlert(title: string, subTitle: string, ok_callback?: Function) {
    let buttons: AlertButton[] = [{
      text: 'OK',
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
        text: 'Cancel',
        role: 'cancel'
      });
    }

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: buttons,
      enableBackdropDismiss: true,
    });
    alert.present();
  }

  bulkUpdate() {
    this.db.get('users').then(_users => {

      this.global.cLog(`users from db are`, _users);

      let data = _users;
      if (data) {
        this.global.putRequest(this.global.base_path + 'api/v1/attendees', data)
          .subscribe(
            res => {

              this.global.cLog(`in bulkUpdate and the response is `, res);
              _users.forEach((element, i) => {
                _users[i].checked = true;
              });

              this.db.create('users', _users).then(res => {
                this.showAlert(`Server Message`, `Synchronization successfull`);
              });

            }, err => {
              this.global.cLog(`some error in bulkUpdate `, err);
            }
          )
      } else {
        this.showAlert(`Alert`, `No User to sync`);
      }
    });
  }

}
