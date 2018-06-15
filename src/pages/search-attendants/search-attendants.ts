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
            this.global.getRequest(`${this.global.base_path}api/v1/attendees?instance_id=${data.instance}&limit=200`)
              .subscribe(res => {

                this.global.isTokenExpire = false;

                this.global.hideLoader();
                this.noData = false;
                this.global.cLog(`getAttendes's response is `, res);

                let attendantsFromAPI = this.formatData(res);

                if (attendantsFromDB.length <= 0) {

                  this.global.cLog(`no attendants in db`);

                  this.attendants = attendantsFromAPI;

                  this.attendants.forEach((attendant, i) => {
                    this.global.cLog('asdf', attendant, i);
                    this.attendants[i].checked = this.attendants[i].checked_in_at ? this.global.isValidDate(new Date(this.attendants[i].checked_in_at)) : false;
                    this.attendants[i].synced = this.attendants[i].checked ? this.attendants[i].checked : this.global.isValidDate(new Date(this.attendants[i].registered_at));
                  });

                } else {

                  this.global.cLog(`attendents are present in db.`);

                  let newAttendantToBeUpdatedInDB: any[] = [];

                  if (attendantsFromAPI.length > attendantsFromDB.length) {

                    this.global.cLog(`in attendantsFromAPI's length is more`);

                    attendantsFromAPI.forEach((singleAttendantFromAPI, i) => {
                      newAttendantToBeUpdatedInDB.push(singleAttendantFromAPI);

                      if (+attendantsFromAPI[i].id == +attendantsFromDB[i].id) {

                        newAttendantToBeUpdatedInDB[i].checked =
                          (attendantsFromAPI[i].checked_in_at ? this.global.isValidDate(new Date(attendantsFromAPI[i].checked_in_at)) : false)
                          ||
                          (attendantsFromDB[i].checked_in_at ? this.global.isValidDate(new Date(attendantsFromDB[i].checked_in_at)) : false);

                        newAttendantToBeUpdatedInDB[i].synced = attendantsFromAPI[i].registered_at ? this.global.isValidDate(new Date(attendantsFromAPI[i].registered_at)) : false ? true : newAttendantToBeUpdatedInDB[i].checked;

                        this.global.cLog(`id's matched in attendantsFromAPI's block`, newAttendantToBeUpdatedInDB[i]);
                      } else {

                        newAttendantToBeUpdatedInDB[i].checked = attendantsFromAPI[i].checked_in_at ? this.global.isValidDate(new Date(attendantsFromAPI[i].checked_in_at)) : false;
                        newAttendantToBeUpdatedInDB[i].synced = attendantsFromAPI[i].registered_at ? this.global.isValidDate(new Date(attendantsFromAPI[i].registered_at)) : false;

                        this.global.cLog(`id's didn't matched in attendantsFromAPI's block`, newAttendantToBeUpdatedInDB[i]);
                      }
                    });

                  } else {

                    this.global.cLog(`in attendantsFromDB's length is more`);

                    attendantsFromDB.forEach((singleAttendantFromDB, i) => {
                      newAttendantToBeUpdatedInDB.push(singleAttendantFromDB);

                      if (+attendantsFromAPI[i].id == +attendantsFromDB[i].id) {
                        newAttendantToBeUpdatedInDB[i].checked =
                          (attendantsFromAPI[i].checked_in_at ? this.global.isValidDate(new Date(attendantsFromAPI[i].checked_in_at)) : false)
                          ||
                          (attendantsFromDB[i].checked_in_at ? this.global.isValidDate(new Date(attendantsFromDB[i].checked_in_at)) : false);

                        newAttendantToBeUpdatedInDB[i].synced =
                          (attendantsFromAPI[i].registered_at ? this.global.isValidDate(new Date(attendantsFromAPI[i].registered_at)) : false)
                            ? true : newAttendantToBeUpdatedInDB[i].checked;

                        this.global.cLog(`id's matched in attendantsFromDB's block`, newAttendantToBeUpdatedInDB[i]);

                      } else {
                        newAttendantToBeUpdatedInDB[i].checked = attendantsFromDB[i].checked_in_at ? this.global.isValidDate(new Date(attendantsFromDB[i].checked_in_at)) : false;
                        newAttendantToBeUpdatedInDB[i].synced = attendantsFromDB[i].registered_at ? this.global.isValidDate(new Date(attendantsFromDB[i].registered_at)) : false;

                        this.global.cLog(`id's didn't matched in attendantsFromDB's block`, newAttendantToBeUpdatedInDB[i]);

                      }
                    });

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
        this.global.showMessage('No Event Selected');
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
