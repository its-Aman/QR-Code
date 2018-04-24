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

  eventList: any[] = [
    { value: '1', text: '1 value value value value value value value' },
    { value: '2', text: '2 value value value value value value value' },
    { value: '3', text: '3 value value value value value value value' },
    { value: '4', text: '4 value value value value value value value' },
    { value: '5', text: '5 value value value value value value value' },
    { value: '6', text: '6 value value value value value value value' },
    { value: '7', text: '7 value value value value value value value' },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider
  ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectActiveEventPage');
  }

  initForm() {
    this.selectEventForm = this.fb.group({
      event: [this.eventList[0].value, [Validators.required]]
    });
  }

  openMenu() {
    this.global.log('Opening menu');
  }

  next() {
    this.global.log('next called', this.selectEventForm);

    if (this.selectEventForm.valid) {
      this.global.log('form is valid');
      localStorage.setItem('event-selected', JSON.stringify(this.eventList[this.selectEventForm.value.event]));
      this.navCtrl.setRoot('MenuPage', { data: null });
    } else {
      this.isFormInvalid = true;
    }
  }
}
