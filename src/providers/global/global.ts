import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Loading, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class GlobalProvider {

  private loader: Loading;
  public base_path: string;

  public client_id: string = '';
  public client_secret: string = '';
  public grant_type: string = '';
  public noNetwork: boolean = false;


  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {
    console.log('Hello GlobalProvider Provider');
    this.base_path = 'http://private-amnesiac-bf0d54-eventonline.apiary-proxy.com/';
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
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      this.noNetwork = error.status == 0;

      if (error.status == 500) {
        console.log('token expired, need to login again');
        this.events.publish('token-expire');
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened; please try again later.');
  };

  getRequest(url: string) {
    return this.http.get<any>(url)
      .pipe(
        retry(2),
        catchError(this.handleError),
    );
  }

  postRequest(url: string, data: any) {
    return this.http.post<any>(url, data, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError),
    );
  }

  postRequestUnauthorize(url: string, data: any) {
    let httpOptions: any = {
      header: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
      ;
    return this.http.post<any>(url, data, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError),
    );
  }

  putRequest(url: string, data: any) {
    return this.http.put<any>(url, data)
      .pipe(
        retry(2),
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

  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(optionalParams));
  }
}
