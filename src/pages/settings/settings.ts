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

  muteSound: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private alrtCtrl: AlertController,
    private events: Events,
  ) {
    this.muteSound = JSON.parse(localStorage.getItem('mute-sound'));
    this.global.reflectchangedLanguage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  changePassword() {
    this.global.cLog('in changePassword()');
  }

  changeLanguage() {
    this.global.cLog('in changeLanguage()');

    let alert = this.alrtCtrl.create();
    alert.setTitle(this.global.ChooseLanguage);
    alert.addInput({
      type: 'radio',
      label: 'English',
      value: 'en',
      checked: this.global.language == 'en',
    });

    alert.addInput({
      type: 'radio',
      label: 'Español',
      value: 'es',
      checked: this.global.language == 'es'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: "Done",
      handler: (val) => {
        this.global.cLog('Handler value is', val);
        // this.db.create('language', val);
        localStorage.setItem('lang', val);
        this.global.language = val;
        this.global.reflectchangedLanguage();
      }
    });

    alert.present();
  }

  soundAndNotification() {
    this.global.cLog('in soundAndNotification');
    let selectedSound = JSON.parse(localStorage.getItem('sound'));

    let alert = this.alrtCtrl.create({
      title: this.global.ChangeSound,
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
    this.global.cLog(`in changeSound and the selected value is`, val);
    localStorage.setItem('sound', JSON.stringify(val));
  }

  changeBasePath() {
    let alert = this.alrtCtrl.create({
      title: this.global.ChangeBasePath,
      inputs: [{
        type: 'input',
        placeholder: this.global.TypeBasepath,
        value: this.global.base_path,
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: (val) => {
            this.global.cLog(`in change basepath and the new basepath is `, val, val["0"]);
            localStorage.setItem('basepath', val["0"]);
            this.events.publish('basepat-changed', val["0"]);
            this.global.base_path = val["0"];
          }
        }],
    });

    alert.present();
  }

  mute(event: any) {
    this.global.cLog(`in mute fun.`, event);
    this.muteSound = event.value;
    localStorage.setItem('mute-sound', JSON.stringify(this.muteSound));
  }


}