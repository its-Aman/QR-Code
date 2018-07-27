import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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
    private db: DatabaseProvider,
    private app: App,
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
    this.global.getRequest(this.global.base_path + `api/v1/events?active=true&latitude=&longitude=&radio=&tickets=true&search=`)
      .subscribe((res: any) => {
        this.global.hideLoader();
        this.global.isTokenExpire = false;
        this.global.cLog('getList data', res);
        this.eventList = res;
        if (this.eventList.length > 0) {
          this.selectEventForm.controls['event'].setValue(this.eventList[0].id);
        } else {
          // this.eventList = [
          //   {
          //     "id": 10202,
          //     "name": "Anual biz meeting for Florida Attorneys",
          //     "description": "",
          //     "start": "2018-08-20 06:00",
          //     "duration": 90,
          //     "time_zone": "America/EDT",
          //     "venue_name": "Miami Beach Convention Center, Miami, FL, US",
          //     "latitude": 25.794769,
          //     "longitude": -80.135344,
          //     "capacity": 2000,
          //     "instance": 730,
          //     "instance_start": "2018-08-20 06:00",
          //     "direct_link": "",
          //     "ticket_types": [
          //       {
          //         "id": 103203,
          //         "name": "General entrance",
          //         "quantity": 100,
          //         "minimum": 1
          //       }
          //     ]
          //   },
          //   {
          //     "id": 10203,
          //     "name": "Monthly review for Florida Illuminatis",
          //     "description": "",
          //     "start": "2018-08-20 06:00",
          //     "duration": 90,
          //     "time_zone": "America/EDT",
          //     "venue_name": "Miami Beach Convention Center, Miami, FL, US",
          //     "latitude": 25.794769,
          //     "longitude": -80.135344,
          //     "capacity": 2000,
          //     "instance": 2005,
          //     "instance_start": "2018-08-27 06:00",
          //     "direct_link": "",
          //     "ticket_types": [
          //       {
          //         "id": 103204,
          //         "name": "General entrance",
          //         "quantity": 100,
          //         "minimum": 1
          //       },
          //       {
          //         "id": 103205,
          //         "name": "VIP Invitee",
          //         "quantity": 10,
          //         "minimum": 1
          //       }
          //     ]
          //   },
          //   {
          //     "id": 10205,
          //     "name": "Unicorns Scientific Review",
          //     "description": "A meeting for unicorns with some scientific background.",
          //     "start": "2018-08-20 05:00",
          //     "duration": 90,
          //     "time_zone": "America/EDT",
          //     "venue_name": "Miami Beach Convention Center, Miami, FL, US",
          //     "latitude": 25.794769,
          //     "longitude": -80.135344,
          //     "capacity": 2000,
          //     "instance": 2005,
          //     "instance_start": "2018-08-20 05:00",
          //     "direct_link": "",
          //     "ticket_types": [
          //       {
          //         "id": 103204,
          //         "name": "General entrance",
          //         "quantity": 100,
          //         "minimum": 1
          //       }
          //     ]
          //   }
          // ]
        }
      }, err => {
        this.global.hideLoader();
        this.global.cLog('getList error', err);
        this.global.showMessage(err.error);
      });
  }

  openMenu() {
    this.global.cLog('Opening menu');
  }

  next() {
    this.global.cLog('next called', this.selectEventForm);

    if (this.selectEventForm.valid) {
      this.global.cLog('form is valid');
      let data = this.eventList.find(val => val.id == this.selectEventForm.controls['event'].value);
      this.db.create('event-selected', data)
        .then((ev) => {
          this.global.cLog(`event-selected done`, ev);
          this.navCtrl.setRoot('MenuPage', { data: data });
        });
    } else {
      this.isFormInvalid = true;
    }
  }

  goToLogin() {
    this.global.cLog(`in goToLogin`);

    localStorage.removeItem('login-response');
    this.db.remove('login-response').then(res => { this.global.cLog(`successfully removed login-response`) });
    this.db.remove('event-selected').then(res => { this.global.cLog(`successfully removed event-selected`) });
    this.global.user_credentials = null;

    this.app.getRootNav().setRoot('LoginPage');
  }

}
