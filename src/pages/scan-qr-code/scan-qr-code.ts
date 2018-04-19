import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@IonicPage()
@Component({
  selector: 'page-scan-qr-code',
  templateUrl: 'scan-qr-code.html',
})
export class ScanQrCodePage {

  scanResult: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    private global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    this.global.log('ionViewDidLoad ScanQrCodePage');
    this.qrScanner.prepare().then((res: QRScannerStatus) => {
      this.global.log('prepare status is ', res);
    }).catch(err => {
      this.global.log("some error in prepare", err);
    });
  }

  scanQR() {
    this.qrScanner.show().then((res: QRScannerStatus) => {
      this.global.log('prepare status is ', res);
      if (res.authorized) {
        this.qrScanner.useBackCamera();
        let nowTimeHours = new Date().getHours();
        if (nowTimeHours > 18 && nowTimeHours < 5) {
          try {
            res.lightEnabled
              ?
              this.qrScanner.enableLight()
              :
              this.qrScanner.disableLight();
          } catch (e) { }
        }
        this.global.log('Now scanning', this.qrScanner);
        let scanSubs = this.qrScanner.scan().subscribe(
          (res: any) => {
            this.global.log('got scanned result', res);
            this.scanResult = res;
            scanSubs.unsubscribe();
          }, err => {
            this.global.log('got error scanned result', err);
            scanSubs.unsubscribe();
          });
        this.global.log('observable is', scanSubs);
      } else {
        this.global.log('permission not granted');
      }
    }).catch(err => {
      this.global.log("some error in show", err);
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
        return new Promise((resolve, reject) => {
          if (status.authorized) {
            // camera permission was granted

            const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
            // start scanning
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              this.global.log('in _startScanner prepare->promise->scan', status);

              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning

              // hack to hide the app and show the preview
              ionApp.style.display = "block";

              resolve(text);
            });

            // show camera preview
            ionApp.style.display = "none";
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

  submit(i: number) {
    let data = { isValid: true };
    if (i == 0) {
      data = { isValid: false };
    }
    this.navCtrl.push('AttendantDetailPage', { data: data });
  }
}
