import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-attendant-detail',
  templateUrl: 'attendant-detail.html',
})
export class AttendantDetailPage {

  address: any;
  event: any;
  attendant: any;
  isValid: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private db: DatabaseProvider
  ) {
    this.attendant = this.navParams.get('data');
    this.global.cLog(`got attendent`, this.attendant);

    if (this.attendant) {
      this.isValid = true;
      db.get('event-selected').then(res => {
        this.global.cLog(`event is ${this.event}`)
        this.event = res;
        if (this.event.latitude && this.event.longitude) {
          this.getAddress();
        }
      });
    } else {
      this.isValid = false;
      this.global.cLog(`Unautorize ticket`)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendantDetailPage');
  }

  getAddress() {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.event.latitude},${this.event.longitude}&key=AIzaSyCnQnyEfpKqea6KVev1LqFq8iZ6jUTaw6M`
    this.global.getRequest(url)
      .subscribe(res => {
        this.global.cLog('address response', res);
        this.address = res.results[0];
      }, err => {
        this.global.cLog('address error', err);
      });
  }

}
