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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private db: DatabaseProvider
  ) {
    // this.event = JSON.parse((localStorage.getItem('event-selected')));
    db.get('event-selected').then(res => {
      this.event = res;
      this.getAddress();
    });

    this.attendant = this.navParams.get('data');
    this.global.log('got attendent', this.attendant);
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
