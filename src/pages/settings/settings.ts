import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private db: DatabaseProvider,
    private alrtCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  changePassword() {
    this.global.log('in changePassword()');
  }

  changeLanguage() {
    this.global.log('in changeLanguage()');

    let alert = this.alrtCtrl.create();
    alert.setTitle('Choose Language');
    alert.addInput({
      type: 'radio',
      label: 'English',
      value: 'en',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Español',
      value: 'es',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: "Done",
      handler: (val) => {
        this.global.log('HAndler value is', val);
        this.db.create('language', val);
      }
    });

    alert.present();
  }

  soundAndNotification() {
    this.global.log('in soundAndNotification()');
  }

}
