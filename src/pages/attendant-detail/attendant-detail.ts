import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-attendant-detail',
  templateUrl: 'attendant-detail.html',
})
export class AttendantDetailPage {

  attendant: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
  ) {
    this.attendant = this.navParams.get('data');
    this.global.log('got attendent', this.attendant);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendantDetailPage');
  }

}
