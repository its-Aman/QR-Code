import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

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
    private alrtCtrl: AlertController,
    private events: Events,
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
    this.global.log('in soundAndNotification');
    let selectedSound = JSON.parse(localStorage.getItem('sound'));

    let alert = this.alrtCtrl.create({
      title: "Change Sound",
      inputs: [
        {
          type: 'radio',
          label: 'Cycle',
          value: 'cycle.mp3',
          checked: selectedSound == 'cycle.mp3',
        },
        {
          type: 'radio',
          label: 'Ding Ling',
          value: 'ding_ling.mp3',
          checked: selectedSound == 'ding_ling.mp3',
        },
        {
          type: 'radio',
          label: 'HTC Reactive',
          value: 'htc_reactive.mp3',
          checked: selectedSound == 'htc_reactive.mp3',
        },
        {
          type: 'radio',
          label: 'Mario Bros Powerup',
          value: 'mario_bros_powerup.mp3',
          checked: selectedSound == 'mario_bros_powerup.mp3',
        },
        {
          type: 'radio',
          label: 'Alert Dew Drops',
          value: 's3_alert_dew_drops.mp3',
          checked: selectedSound == 's3_alert_dew_drops.mp3.',
        }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: (val) => {
            this.changeSound(val);
          }
        },
      ]
    });

    alert.present();
  }

  changeSound(val: any) {
    this.global.log(`in changeSound and the selected value is`, val);
    localStorage.setItem('sound', JSON.stringify(val));
  }

  changeBasePath() {
    let alert = this.alrtCtrl.create({
      title: "Change BasePath",
      inputs: [{
        type: 'input',
        placeholder: 'Type basepath',
        value: JSON.parse(localStorage.getItem('basepath'))["0"] || this.global.base_path
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: (val) => {
            this.global.log(`in change basepath and the new basepath is `, val, val["0"]);
            localStorage.setItem('basepath', JSON.stringify(val));
            this.events.publish('basepat-changed', val["0"]);
            this.global.base_path = val["0"];
          }
        }],
    });

    alert.present();
  }
}