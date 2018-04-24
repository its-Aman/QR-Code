import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Loading } from 'ionic-angular';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class GlobalProvider {

  loader: Loading;
  base_path: string;

  public client_id: string = '';
  public client_secret: string = '';
  public grant_type: string = '';

  constructor(private http: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    console.log('Hello GlobalProvider Provider');
    this.base_path = 'http://private-amnesiac-bf0d54-eventonline.apiary-proxy.com/api/v1/';
  }

  getRequest(url: string) {
    return this.http.get<any>(url);
  }

  postRequest(url: string, data: any) {
    return this.http.post<any>(url, data, httpOptions);
  }

  postRequestUnauthorize(url: string, data: any) {
    let httpOptions: any = {
      header: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.post<any>(url, data, httpOptions);
  }
  
  showMessage(message: string, duration: number = 2000, position: string = 'top') {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: false,
    }).present();
  }

  showLoader(msg?) {
    this.loader = this.loadingCtrl.create({
      content: msg ? msg : 'Loading..',
      dismissOnPageChange: true
    });
    this.loader.present().catch(res => { console.log("exception in show loader") });
  }


  hideLoader() {
    if (this.loader) {
      try {
        this.loader.dismiss()
          .then(res => {
            this.loader = null;
          })
          .catch(res => {
            console.log("exception in loader hide");
            setTimeout(v => { this.hideLoader(); }, 100)
          });
      }
      catch (e) { }
    }
  }

  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }
}
