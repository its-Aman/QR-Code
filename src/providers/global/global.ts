import { DatabaseProvider } from './../database/database';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Loading, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class GlobalProvider {

  isTokenExpire: boolean = false;
  private loader: Loading;
  public base_path: string;

  /*
  client_id=E3FDE09D-030C-4E78-B548-9888BF44
  client_secret=my-secret
  grant_type=password
  username=smelgin@gmail.com
  password=andrescock
  */

  public client_id: string = 'E3FDE09D-030C-4E78-B548-9888BF44';
  public client_secret: string = 'my-secret';
  public grant_type: string = 'password';
  public noNetwork: boolean = false;

  public user_credentials = JSON.parse(localStorage.getItem('login-response'));

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private db: DatabaseProvider,
  ) {
    console.log('Hello GlobalProvider Provider');

    //testing server
    // this.base_path = 'http://private-amnesiac-bf0d54-eventonline.apiary-proxy.com/';

    //live server
    this.base_path = 'http://eventonline.info:3500/';
  }

  private handleError(error: HttpErrorResponse) {
    console.log('handleError error is', error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code `, error.status +
        `body was: `, error.error);
      this.noNetwork = error.status == 0;

      if (error.status == 500) {
        console.log('server error');
      } else if (error.status == 401) {
        console.log('token expired, need to login again');
        this.events.publish('token-expire');
        this.isTokenExpire = true;
        this.getToken();
      } else {
        this.isTokenExpire = false;
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened; please try again later.');
  };

  getRequest(url: string) {
    this.cLog(`in getRequest and the user is`, this.user_credentials);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + this.getToken(),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.get<any>(url, httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
    );
  }

  postRequest(url: string, data: any) {
    this.cLog(`in postRequest and the this.user is`, this.user_credentials);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + this.getToken(),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<any>(url, data, httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
    );
  }

  postRequestUnauthorised(url: string, data: any) {

    this.cLog(`in postRequestUnauthorize and the data is`, data);

    return this.http.post<any>(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .pipe(
        retry(1),
        catchError(this.handleError),
    );
  }

  putRequest(url: string, data: any) {
    this.cLog(`in putRequest and the this.user is`, this.user_credentials);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + this.getToken(),
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.put<any>(url, data, httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError),
    );
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
    try {
      this.loader.dismiss()
        .then(res => {
          // this.loader = null;
          console.log("loader hide done", res);
        })
        .catch(err => {
          console.log("exception in loader hide", err);
          setTimeout(v => { this.hideLoader(); }, 100)
        });
    }
    catch (e) { }
  }

  cLog(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);

    // alert(JSON.stringify(message) + JSON.stringify(optionalParams));
  }

  getToken() {
    this.cLog(`in get token`, this.user_credentials.access_token);

    if (this.isTokenExpire) {
      this.cLog(`token is expired getting refresh token`);
      this.http.post(this.base_path + 'oauth2/refresh', `client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=refresh_token&refresh_token=${this.user_credentials.refresh_token}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .subscribe(
          res => {
            localStorage.setItem('login-response', JSON.stringify(res));
            this.user_credentials = res;
            this.db.create('login-response', res).then(res => {
              this.cLog(`saved the refresh token refresh token`);
            });
            return res["access_token"];
          }, err => {
            this.cLog(`some error in getting refresh token`);
          });
    } else {
      this.cLog(`sending token`);
      return this.user_credentials.access_token;
    }
  }
}
