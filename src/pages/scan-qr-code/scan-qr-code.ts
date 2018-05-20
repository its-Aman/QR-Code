import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NativeAudio } from '@ionic-native/native-audio';

@IonicPage()
@Component({
  selector: 'page-scan-qr-code',
  templateUrl: 'scan-qr-code.html',
})
export class ScanQrCodePage {

  scanResult: any; //1FBEB142-843E-495F-A8E2-E59F0BE3162A
  @ViewChild('content') content: Content

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    private global: GlobalProvider,
    private db: DatabaseProvider,
    private diagnostic: Diagnostic,
    private nativeAudio: NativeAudio,
  ) {
  }

  ionViewDidLoad() {
    this.global.log('ionViewDidEnter ScanQrCodePage');
    // this.playSound();
  }

  ionViewDidEnter() {
    this.global.log('ionViewDidLoad ScanQrCodePage', this.content.getNativeElement());
    this.diagnostic.isCameraAuthorized().then(res => {
      this.global.log(`Got the isCameraAuthorized res `, res);
      if (res) {
        this.finalScan();
      } else {
        this.diagnostic.requestCameraAuthorization().then(res => {
          this.global.log(`Got the requestCameraAuthorization res `, res);
          if (res) {
            this.finalScan();
          } else {
            this.global.log(`App needs location to fetch data, please enable location and set location accuracy mode to high.`);
          }
        }).catch(err => {
          this.global.log(`Got the requestCameraAuthorization error `, err);
        });
      }
    }).catch(err => {
      this.global.log(`Got the isCameraAuthorized error`, err);
    });
  }

  finalScan() {
    this.qrScanner.prepare().then((res: QRScannerStatus) => {
      this.global.log('prepare status is ', res);
      this.scanQR_Code().then(res => {
        this.global.log('scanQR_Code in ionViewDidLoad', res);
        this.checkForUserPresentLocally(res);
      });
    }).catch(err => {
      this.global.log("some error in prepare", err);
      if (err.code == 1) {
        this.global.showMessage(`The app needs the camera to scan QR codes`);
      }
    });
  }

  checkForUserPresentLocally(id: string) {
    this.db.get('users').then((res: any[]) => {
      this.global.log(`Got the users, now updating the time ${res}`);

      if (res.length > 0) {
        let user = res.find((user) => {
          return user.id == id;
        });

        if (user) {
          this.global.log(`User found ${user}, now updating checked_in_time`);
          res[res.indexOf(user)].checked_in_at = (new Date()).toISOString();
          this.db.create('users', res)
            .then(update => {
              this.global.log(`Users updated successfully ${update}`);
              this.navCtrl.push('AttendantDetailPage', { data: user });
            }).catch(err => {
              this.global.log(`Users updated error ${err}`);
              this.navCtrl.push('AttendantDetailPage', { data: null });
            });
        } else {
          this.navCtrl.push('AttendantDetailPage', { data: null });
        }
      }
    });
  }

  async scanQR_Code(): Promise<string> {
    try {
      this.global.log('in scanPatient try');
      this.scanResult = await this._startScanner();
      this.global.log('scanResult is ', this.scanResult);
    }
    catch (err) {
      this.global.log('in scanPatient catch', err);
      throw err;
    }

    return this.scanResult;
  }

  private _startScanner(): Promise<any> {
    this.global.log('in _startScanner');
    // Optionally request the permission early
    return this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        this.global.log('in _startScanner prepare', status);

        let nowTimeHours = new Date().getHours();
        if (nowTimeHours > 18 && nowTimeHours < 5) {
          try {
            status.lightEnabled
              ?
              this.qrScanner.enableLight()
              :
              this.qrScanner.disableLight();
          } catch (e) { }
        }

        return new Promise((resolve, reject) => {
          if (status.authorized) {
            // camera permission was granted

            const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
            const _content = this.content.getNativeElement();
            // start scanning
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              this.global.log('in _startScanner prepare->promise->scan', status);
              //play sound
              this.playSound();

              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning

              // hack to hide the app and show the preview
              ionApp.style.display = "block";
              _content.style.display = "block";

              resolve(text);
            });

            // show camera preview
            _content.style.display = "contents";
            ionApp.style.display = "contents";
            this.qrScanner.show();
          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            this.qrScanner.openSettings();
            reject(new Error('MESSAGES.QRSCANNER.CHANGE_SETTINGS_ERROR'));
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            reject(new Error('MESSAGES.QRSCANNER.PERMISSION_DENIED_ERROR'));
          }
        });
      });
  }

  playSound() {
    let selectedSound = JSON.parse(localStorage.getItem('sound'));
    this.global.log(`in play sound and the selected sound is`, selectedSound)
    if (!selectedSound) {
      this.global.showMessage(`Please select a sound in settings`);
      return;
    } else {
      this.nativeAudio.preloadSimple(selectedSound, `assets/sounds/${selectedSound}`)
        .then((res) => {
          this.global.log(`in success callback of preload sample, `, res);
          this.nativeAudio.play(selectedSound)
            .then((res) => {
              this.global.log(`in success callback of play, `, res);
              setTimeout(() => {
                this.nativeAudio.stop(selectedSound)
                  .then(res => {
                    this.global.log(`in success callback of stop, `, res);
                  }).catch(err => {
                    this.global.log(`in err callback of stop, `, err);
                  });
                this.nativeAudio.unload(selectedSound)
                  .then(res => {
                    this.global.log(`in success callback of unload, `, res);
                  }).catch(err => {
                    this.global.log(`in err callback of unload, `, err);
                  });
              }, 5000);
            }).catch((err) => {
              this.global.log(`in err callback of play, `, err);
            });
        }).catch((err) => {
          this.global.log(`in err callback of preload sample, `, err);
        });
    }
  }

  submit(i: number) {
    if (i == 0) {
      this.navCtrl.push('AttendantDetailPage', { data: null });
    } else {
      this.navCtrl.push('AttendantDetailPage', { data: { isValid: true } });
    }
  }
}
