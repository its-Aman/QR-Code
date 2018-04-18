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
  attendants: any[] = [
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: true },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: true },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: false },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: true },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: true },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: false },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: true },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: false },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: false },
    { name: 'Mr. Arnub gawde', time: '06:51', isRead: true },
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchAttendantsPage');
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
