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
    this.global.log(`got attendent ${this.attendant}`);

    if (this.attendant) {
      this.isValid = true;
      db.get('event-selected').then(res => {
        this.global.log(`event is ${this.event}`)
        this.event = res;
        this.getAddress();
      });
    } else {
      this.isValid = false;
      this.global.log(`Unautorize ticket`)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendantDetailPage');
  }

  getAddress() {
    let url = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${this.event.latitude},${this.event.longitude}`
    this.global.getRequest(url)
      .subscribe(res => {
        this.global.log('address response', res);
        this.address = res.results[0];
      }, err => {
        this.global.log('address error', err);
      });
  }

}
