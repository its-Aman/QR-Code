import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-select-active-event',
  templateUrl: 'select-active-event.html',
})
export class SelectActiveEventPage {

  selectEventForm: FormGroup;
  isFormInvalid: boolean = false;

  eventList: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    private db: DatabaseProvider
  ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectActiveEventPage');
    this.getEventList();
  }

  initForm() {
    this.selectEventForm = this.fb.group({
      event: [null, [Validators.required]]
    });
  }

  getEventList() {
    this.global.showLoader();
    this.global.getRequest(this.global.base_path + 'api/v1/events?tickets=true')
      .subscribe(res => {
        this.global.hideLoader();
        this.global.log('getList data', res);
        this.eventList = res;
        this.selectEventForm.controls['event'].setValue(this.eventList[0].id);
      }, err => {
        this.global.hideLoader();
        this.global.log('getList error', err);
      });
  }

  openMenu() {
    this.global.log('Opening menu');
  }

  next() {
    this.global.log('next called', this.selectEventForm);

    if (this.selectEventForm.valid) {
      this.global.log('form is valid');
      let data = this.eventList.find(val => val.id == this.selectEventForm.controls['event'].value);
      this.db.create('event-selected', data);
      // localStorage.setItem('event-selected', JSON.stringify(data));
      this.navCtrl.setRoot('MenuPage', { data: data });
    } else {
      this.isFormInvalid = true;
    }
  }
}
