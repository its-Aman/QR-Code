import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, AlertButton } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootMenuPage: string = 'SearchAttendantsPage';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
    public alertCtrl: AlertController,
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  scanQRCode() {
    this.global.log('clicked scanQRCode');
    this.navCtrl.push('ScanQrCodePage', { data: null });
  }

  syncToServer() {
    this.global.log('clicked syncToServer');
    this.showAlert(`Server Message`, `Synchronization successfull`);
    // this.navCtrl.push('SearchAttendantsPage', {data: null});    
  }

  cleanEventData() {
    this.global.log('clicked cleanEventData');
    this.showAlert(`Warning`, `The information not sent will be lost. Are you sure?`, () => {
      this.global.log('Clearing event log data');
    });
    // this.navCtrl.push('SearchAttendantsPage', {data: null});    

  }

  changeEvent() {
    this.global.log('clicked changeEvent');
    this.navCtrl.push('SelectActiveEventPage', { data: null });
  }

  settings() {
    this.global.log('clicked settings');
    this.navCtrl.push('SettingsPage', { data: null });
  }

  signout() {
    this.global.log('clicked signout');
    this.app.getRootNav().setRoot('LoginPage');
  }

  showAlert(title: string, subTitle: string, ok_callback?: Function) {
    let buttons: AlertButton[] = [{
      text: 'OK',
      handler: () => {
        this.global.log('OK pressed');

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

}
