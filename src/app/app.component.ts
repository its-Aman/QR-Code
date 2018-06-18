import { GlobalProvider } from './../providers/global/global';
import { DatabaseProvider } from './../providers/database/database';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // interval: number;
  // currentTime: number;
  // exptoken: any;
  // isVerified: boolean;
  @ViewChild(Nav) nav: Nav;
  rootPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private db: DatabaseProvider,
    private events: Events,
    private global: GlobalProvider
  ) {

    // this.refreshTokenLogic();
    this.global.cLog(`in app component`);

    this.initializeApp();
    this.listenForTokenExpire();
    this.global.reflectchangedLanguage();

    let sound = JSON.parse(localStorage.getItem('sound'));
    let basePath = localStorage.getItem('basepath');
    let muteSound = JSON.parse(localStorage.getItem('mute-sound'));
    let lang = localStorage.getItem('lang');

    this.global.cLog(`preloaded sound is `, sound);
    this.global.cLog(`preloaded basepath is `, basePath);

    if (muteSound == undefined || muteSound == null) {
      localStorage.setItem('mute-sound', JSON.stringify(false));
    }

    if (!sound) {
      localStorage.setItem('sound', JSON.stringify('cycle.mp3'));
    }

    if (!basePath) {
      this.global.base_path = 'http://eventonline.info:3500/';
      localStorage.setItem('basepath', this.global.base_path);
    }

    if (!lang) {
      localStorage.setItem('lang', 'en');
    }

    this.db.get(`login-response`).then(res => {
      this.global.cLog(`login-response's response is`, res);
      if (res) {
        this.db.get(`event-selected`).then(res => {
          this.global.cLog(`event-selected's response is`, res);
          if (res) {
            this.rootPage = 'MenuPage';
          } else {
            this.rootPage = 'SelectActiveEventPage';
          }
        });
      } else {
        this.rootPage = 'LoginPage';
      }
    });

    // if (this.db.get(`login-response`)) {
    //   if (this.db.get('event-selected')) {
    //     this.rootPage = 'MenuPage';
    //   } else {
    //     this.rootPage = 'SelectActiveEventPage';
    //   }
    // } else {
    //   this.rootPage = 'LoginPage';
    // }
  }

  listenForTokenExpire() {
    this.events.subscribe('token-expire', () => {
      console.log('Token expires, now calling for login again');
      localStorage.clear();
      this.rootPage = 'LoginPage';

    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


}
