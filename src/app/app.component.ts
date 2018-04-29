import { DatabaseProvider } from './../providers/database/database';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private db: DatabaseProvider,
    private events: Events,
  ) {

    this.initializeApp();

    db.get(`login-response`).then(res => {
      if (res) {
        db.get(`event-selected`).then(res => {
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

    // if (db.get(`login-response`)) {
    //   if (db.get('event-selected')) {
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
