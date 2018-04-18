import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

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
    public app: App
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  scanQRCode() {
    this.global.log('clicked scanQRCode');
    this.rootMenuPage = 'ScanQrCodePage';
  }

  syncToServer() {
    this.global.log('clicked syncToServer');
    this.rootMenuPage = 'SearchAttendantsPage';    
  }

  cleanEventData() {
    this.global.log('clicked cleanEventData');
    this.rootMenuPage = 'SearchAttendantsPage';    
  }

  changeEvent() {
    this.global.log('clicked changeEvent');
    this.rootMenuPage = 'SelectActiveEventPage';
  }

  settings() {
    this.global.log('clicked settings');
  }

  signout() {
    this.global.log('clicked signout');
    this.app.getRootNav().setRoot('LoginPage');
  }


}
