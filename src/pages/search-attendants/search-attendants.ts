import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatePipe } from '@angular/common';

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
        this.global.cLog(`In db.get.users`, res);
        this.attendants = res;
      });
    });

    this.events.subscribe('basepat-changed', data => {
      this.global.cLog(`In basepat-changed`, data);

      // this.getAttendes();

      this.db.get('users').then(res => {
        this.global.cLog(`In db.get.users`, res);
        this.attendants = res;
      });

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchAttendantsPage');
    // this.db.get('asdf').then(res => this.global.cLog(`asdf present res`, res)).catch(err => this.global.cLog(`asdf error `, err));
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter SearchAttendantsPage');
  }

  getAttendes() {
    this.db.get('event-selected').then(data => {
      if (data) {

        this.db.get('users').then(
          (attendantsFromDB: any[]) => {
            this.global.cLog(`in getAttendes and attendantsFromDB is `, attendantsFromDB);

            this.global.showLoader();
            this.global.getRequest(`${this.global.base_path}api/v1/attendees?instance_id=${data.instance}`)
              .subscribe(res => {

                this.global.isTokenExpire = false;

                this.global.hideLoader();
                this.noData = false;
                this.global.cLog(`getAttendes's response is `, res);

                let attendantsFromAPI = this.formatData(res);
                // debugger;
                if (!attendantsFromDB) {

                  this.global.cLog(`no attendants in db`);

                  this.attendants = attendantsFromAPI;

                  this.attendants.forEach((attendant, i) => {
                    this.global.cLog('asdf', attendant, i);
                    this.attendants[i].checked = this.attendants[i].checked_in_at ? true : false;
                    this.attendants[i].synced = true;
                    this.attendants[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(this.attendants[i].checked_in_at).setHours(0, 0, 0, 0);
                  });

                } else {

                  this.global.cLog(`attendents are present in db.`);

                  let newAttendantToBeUpdatedInDB: any[] = [];

                  let length = attendantsFromAPI.length > attendantsFromDB.length ? attendantsFromAPI.length : attendantsFromDB.length;
                  let isApiArrayBig: boolean = attendantsFromAPI.length > attendantsFromDB.length;

                  for (let i = 0; i < length; i++) {

                    if (+attendantsFromAPI[i].id == +attendantsFromDB[i].id) {
                      if (attendantsFromAPI[i].checked_in_at && !attendantsFromDB[i].checked_in_at) {
                        attendantsFromAPI[i].checked = true;
                        attendantsFromAPI[i].synced = true;
                        attendantsFromAPI[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromAPI[i].checked_in_at).setHours(0, 0, 0, 0);
                        newAttendantToBeUpdatedInDB.push(attendantsFromAPI[i]);
                      } else if (!attendantsFromAPI[i].checked_in_at && attendantsFromDB[i].checked_in_at) {
                        attendantsFromDB[i].checked = true;
                        attendantsFromDB[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromDB[i].checked_in_at).setHours(0, 0, 0, 0);
                        newAttendantToBeUpdatedInDB.push(attendantsFromDB[i]);
                      } else if (attendantsFromAPI[i].checked_in_at && attendantsFromDB[i].checked_in_at) {
                        if (new Date(attendantsFromAPI[i].checked_in_at).getTime() < new Date(attendantsFromDB[i].checked_in_at).getTime()) {
                          attendantsFromDB[i].checked = attendantsFromDB[i].checked_in_at ? true : false;
                          attendantsFromDB[i].synced = true;
                          attendantsFromDB[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromDB[i].checked_in_at).setHours(0, 0, 0, 0);
                          newAttendantToBeUpdatedInDB.push(attendantsFromDB[i]);
                        } else {
                          attendantsFromAPI[i].checked = attendantsFromAPI[i].checked_in_at ? true : false;
                          attendantsFromAPI[i].synced = true;
                          attendantsFromAPI[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromAPI[i].checked_in_at).setHours(0, 0, 0, 0);
                          newAttendantToBeUpdatedInDB.push(attendantsFromAPI[i]);
                        }
                      } else {
                        if (isApiArrayBig) {
                          attendantsFromAPI[i].checked = attendantsFromAPI[i].checked_in_at ? true : false;
                          attendantsFromAPI[i].synced = true;
                          attendantsFromAPI[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromAPI[i].checked_in_at).setHours(0, 0, 0, 0);
                          newAttendantToBeUpdatedInDB.push(attendantsFromAPI[i]);
                        } else {
                          attendantsFromDB[i].checked = attendantsFromDB[i].checked_in_at ? true : false;
                          attendantsFromDB[i].synced = true;
                          attendantsFromDB[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromDB[i].checked_in_at).setHours(0, 0, 0, 0);
                          newAttendantToBeUpdatedInDB.push(attendantsFromDB[i]);
                        }
                      }

                      this.global.cLog(`id's matched in attendantsFromAPI's block`, newAttendantToBeUpdatedInDB[i]);
                    } else {

                      if (isApiArrayBig) {
                        attendantsFromAPI[i].checked = attendantsFromAPI[i].checked_in_at ? true : false;
                        attendantsFromAPI[i].synced = true;
                        attendantsFromAPI[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromAPI[i].checked_in_at).setHours(0, 0, 0, 0);
                        newAttendantToBeUpdatedInDB.push(attendantsFromAPI[i]);
                      } else {
                        attendantsFromDB[i].checked = attendantsFromDB[i].checked_in_at ? true : false;
                        attendantsFromDB[i].synced = true;
                        attendantsFromDB[i].isToday = new Date().setHours(0, 0, 0, 0) == new Date(attendantsFromDB[i].checked_in_at).setHours(0, 0, 0, 0);
                        newAttendantToBeUpdatedInDB.push(attendantsFromDB[i]);
                      }

                      this.global.cLog(`id's didn't matched in attendantsFromAPI's block`, newAttendantToBeUpdatedInDB[i]);
                    }

                  }
                  this.attendants = newAttendantToBeUpdatedInDB;

                }
                this.db.create('users', this.attendants);
              }, err => {
                this.global.hideLoader();
                this.noData = true;
                this.global.showMessage(err.error);
                this.global.cLog('getAttendes error', err);
              });
          }).catch(err => {
            this.global.cLog(`no users present in local database`, err);
          });

      } else {
        this.noData = true;
        this.global.showMessage(this.global.NoEventSelected);
      }
    }).catch(err => {
      this.global.cLog(`no event present in local database`, err);
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
    if (this.searchKey && this.searchKey.length > 2) {
      this.global.cLog('in if', this.searchKey);
      this.attendants = this.attendants.filter(val => { return val.name.toLowerCase().includes(this.searchKey.toLowerCase()) });
      this.noSearchResult = this.attendants.length == 0;
    } else {
      this.db.get('users').then(res => {
        this.global.cLog(`In db.get.users ${res}`);
        this.attendants = res;
        this.noSearchResult = this.attendants ? this.attendants.length == 0 : false;
      });
    }
  }

  openDetails(i: number) {
    this.global.cLog('openDetails(i) ', this.attendants[i]);
    this.navCtrl.push('AttendantDetailPage', { data: this.attendants[i] });
  }

  checkAttendee(i): boolean {
    let _return = Boolean((new Date(this.attendants[i].checked_in_at)).getFullYear());
    // this.global.cLog(`in checkAttendee returning, `, _return);
    return _return;
  }
}
