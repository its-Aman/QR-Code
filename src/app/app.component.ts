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

  interval: number;
  currentTime: number;
  exptoken: any;
  isVerified: boolean;
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

    this.refreshTokenLogic();

    this.initializeApp();
    // this.listenForTokenExpire();

    let sound = JSON.parse(localStorage.getItem('sound'));
    let basePath = JSON.parse(localStorage.getItem('basepath'));

    this.global.cLog(`preloaded sound is `, sound);
    this.global.cLog(`preloaded basepath is `, basePath);

    if (!sound) {
      localStorage.setItem('sound', JSON.stringify('cycle.mp3'));
    }

    if (basePath && basePath["0"]) {
      this.global.base_path = basePath["0"];
    }

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

  refreshTokenLogic() {
    this.interval = setInterval(() => {
      this.alertFunc();
    }, 1000);
  }

  alertFunc() {
    // console.log("aaaaaa")
    let token = JSON.parse(localStorage.getItem("login-response"));
    let data = `client_id=${this.global.client_id}&client_secret=${this.global.client_secret}&grant_type=refresh_token&refresh_token=${token.refresh_token}`;

    if (token.access_token != null) {
      if (this.global.isTokenExpire && this.isVerified == false) {
        console.log("yes............");
        this.isVerified = true;

        this.global.postRequest(this.global.base_path + 'oauth2/refresh', data).subscribe((res) => {
          console.log("yes----------", res);
          this.isVerified = false
          localStorage.setItem("login-response", res);
        });
      }
      this.exptoken = token.expires_in;
      this.currentTime = Math.floor((Date.now()) / 1000);

      this.global.cLog("expire token", this.exptoken);

      if (this.currentTime == this.exptoken - 20) {
        console.log("token is expired");

        this.global.postRequest(this.global.base_path + 'oauth2/refresh', data).subscribe((res) => {
          console.log("yes----------", res);
          localStorage.setItem("login-response", res);
        });
      }
      else {
        // console.log("token is not expired ")
      }
    }
    else {
      // console.log("token not found")
    }
  }

}
