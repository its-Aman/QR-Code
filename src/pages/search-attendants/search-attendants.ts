import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search-attendants',
  templateUrl: 'search-attendants.html',
})
export class SearchAttendantsPage {

  isSearch: boolean = false;
  shouldShowCancel: boolean = true;
  searchKey: string;
  attendants: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private db: DatabaseProvider
  ) {
    this.getAttendes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchAttendantsPage');
  }

  getAttendes() {
    // let data = JSON.parse(localStorage.getItem('event-selected'));
    this.db.get('event-selected').then(data => {
      if (data) {
        this.global.showLoader();
        this.global.getRequest(`${this.global.base_path}api/v1/attendee?instance_id=${data.instance_id}&limit=200`)
          .subscribe(res => {
            this.global.hideLoader();
            this.global.log('getAttendes res', res);
            this.attendants = this.formatData(res);
          }, err => {
            this.global.hideLoader()
            this.global.log('getAttendes error', err);
          });
      } else {
        this.global.showMessage('No Event Selected');
      }
    });
  }

  formatData(data: any): any[] {
    let r = {}, t = [];

    data.values.forEach((val, i) => {

      val.forEach((foo, i) => {

        r[data.fields[i]] = foo;

      });
      t.push(r);
      r = {};
    });
    this.global.log('formatted value', t);
    return t;
  }
  search(foo) {
    this.global.log('opening search', foo);
    this.isSearch = !this.isSearch;
  }

  onInput(ev) {
    this.global.log('onInput($event) clicked', ev);
  }

  openDetails(i: number) {
    this.global.log('openDetails(i) ', i);

    this.navCtrl.push('AttendantDetailPage', { data: this.attendants[i] });
  }
}
