import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search-attendants',
  templateUrl: 'search-attendants.html',
})
export class SearchAttendantsPage {

  noSearchResult: boolean;
  isSearch: boolean = false;
  shouldShowCancel: boolean = true;
  searchKey: string;
  attendants: any[];
  noData: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private db: DatabaseProvider,
    private events: Events
  ) {
    this.getAttendes();

    this.events.subscribe('ionViewDidEnter-MenuPage', () => {
      this.global.cLog(`In ionViewDidEnter-MenuPage`);

      this.db.get('users').then(res => {
        this.global.cLog(`In db.get.users ${res}`);
        this.attendants = res;
      });
    });

    this.events.subscribe('basepat-changed', data => {
      this.global.cLog(`In basepat-changed`, data);
      this.getAttendes();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchAttendantsPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter SearchAttendantsPage');
  }

  getAttendes() {
    this.db.get('event-selected').then(data => {
      if (data) {
        this.global.showLoader();
        this.global.getRequest(`${this.global.base_path}api/v1/attendee?instance_id=${data.instance_id}&limit=200`)
          .subscribe(res => {
            this.global.hideLoader();
            this.noData = false;
            this.global.cLog('getAttendes res', res);
            this.attendants = this.formatData(res);
            this.db.create('users', this.attendants);
          }, err => {
            this.global.hideLoader();
            this.global.cLog('getAttendes error', err);
            this.noData = true;
          });
      } else {
        this.noData = true;
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
    this.global.cLog('formatted value', t);
    return t;
  }

  search(foo) {
    this.global.cLog('opening search', foo);
    this.isSearch = !this.isSearch;
  }

  onInput(ev) {
    this.global.cLog('onInput($event) clicked', this.searchKey, ev);
    if (this.searchKey.length > 2) {
      this.global.cLog('in if', this.searchKey);
      this.attendants = this.attendants.filter(val => { return val.name.toLowerCase().includes(this.searchKey.toLowerCase()) });
      this.noSearchResult = this.attendants.length == 0;
    } else {
      this.db.get('users').then(res => {
        this.global.cLog(`In db.get.users ${res}`);
        this.attendants = res;
        this.noSearchResult = this.attendants.length == 0;
      });
    }
  }

  openDetails(i: number) {
    this.global.cLog('openDetails(i) ', i);

    this.navCtrl.push('AttendantDetailPage', { data: this.attendants[i] });
  }
}
