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

  totalUsers: number = 0;
  checkedInUser: number = 0;
  address: any;
  event: any;
  attendant: any;
  isValid: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private db: DatabaseProvider
  ) {
    this.attendant = this.navParams.get('data');
    // this.attendant = {
    //   "id": "97757",
    //   "name": "Andrew Example97757",
    //   "document_id": "97757",
    //   "ticket_type_id": "8",
    //   "checked_in_at": "2018-04-03 23:24:53",
    //   "registered_at": "0000-00-00 00:00:00"
    // }
    this.global.cLog(`got attendent`, this.attendant);

    if (this.attendant) {
      this.isValid = true;
      this.getCheckedUncheckedDetails();
      
      db.get('event-selected').then(res => {
        this.event = res;
        this.global.cLog(`event is`, this.event);
        //   this.event = {
        //     "id": "8",
        //     "name": "Seminario Empresarial EAR Alianza",
        //     "description": "<p>La verdadera riqueza se construye desde nuestra raíz interior. Salud, suficiente Inteligencia Financiera, Paz, Felicidad, Longevidad, son algunas expresiones de la <i>verdadera riqueza</i>. Pretender ser abundante en dinero, descuidando otras áreas, nos lleva al límite de una vida vacía y sin equilibrio. Aprende con <b><a href=\"https://chopra.com/\">Deepak Chopra</a></b>, el renombrado médico holístico y autor de decenas bests sellers, como desarrollarte equilibradamente, para tener una verdadera y duradera riqueza.</p>\r\n",
        //     "start": "2018-03-04 13:00:00",
        //     "duration": "60",
        //     "time_zone": "America/Bogota",
        //     "venue_name": "Centro de Convenciones Plaza Mayor, Carrera 57, Medellín, Antioquia, Colombia",
        //     "latitude": "6.243088245391846",
        //     "longitude": "-75.576370239257810",
        //     "capacity": "1000",
        //     "ticket_types": [
        //         {
        //             "id": "34",
        //             "name": "test2522ssszzz",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "36",
        //             "name": "test888",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "37",
        //             "name": "test99999",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "40",
        //             "name": "test5555555",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "41",
        //             "name": "test2522ssszzz",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "42",
        //             "name": "test2522",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "43",
        //             "name": "test257",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "47",
        //             "name": "Prueba7777",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "52",
        //             "name": "Prueba",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         },
        //         {
        //             "id": "53",
        //             "name": "Prueba00000",
        //             "quantity": "432",
        //             "minimum_per_order": "1"
        //         }
        //     ],
        //     "instance": "730",
        //     "direct_link": "http://www.eventonline.info/backend/event/publicView/id/8"
        // }
        // if (this.event.latitude && this.event.longitude) {
        //   this.getAddress();
        // }
      });
    } else {
      this.isValid = false;
      this.global.cLog(`Unautorize ticket`)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendantDetailPage');
  }

  getCheckedUncheckedDetails() {
    this.db.get('users').then(users => {
      this.global.cLog(`got the users for getCheckedUncheckedDetails`, users);

      this.totalUsers = users.length;

      users.forEach((_user, i) => {
        if (_user.checked && _user.synced) {
          this.checkedInUser++;
        }
      });
    });
  }

  getAddress() {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.event.latitude},${this.event.longitude}&key=AIzaSyCnQnyEfpKqea6KVev1LqFq8iZ6jUTaw6M`
    this.global.getRequest(url)
      .subscribe(res => {
        this.global.cLog('address response', res);
        this.address = res.results[0];
      }, err => {
        this.global.cLog('address error', err);
      });
  }

}
