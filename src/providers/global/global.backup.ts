// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { LoadingController, ToastController, Loading, Events } from 'ionic-angular';

// import { Observable } from 'rxjs/Observable';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import { catchError, retry } from 'rxjs/operators';

// @Injectable()
// export class GlobalProvider {

//   private loader: Loading;
//   public base_path: string;

//   /*
//   client_id=E3FDE09D-030C-4E78-B548-9888BF44
//   client_secret=my-secret
//   grant_type=password
//   username=smelgin@gmail.com
//   password=andrescock
//   */

//   public client_id: string = 'E3FDE09D-030C-4E78-B548-9888BF44';
//   public client_secret: string = 'my-secret';
//   public grant_type: string = 'password';
//   public noNetwork: boolean = false;

//   public user = JSON.parse(localStorage.getItem('user'));

//   constructor(
//     private http: HttpClient,
//     private toastCtrl: ToastController,
//     private loadingCtrl: LoadingController,
//     private events: Events,
//   ) {
//     console.log('Hello GlobalProvider Provider');

//     //testing server
//     // this.base_path = 'http://private-amnesiac-bf0d54-eventonline.apiary-proxy.com/';

//     //live server
//     this.base_path = 'http://eventonline.info:3500/';
//   }

//   private handleError(error: HttpErrorResponse) {
//     console.log('handleError error is', error);

//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred. Handle it accordingly.
//       console.error('An error occurred:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code.
//       // The response body may contain clues as to what went wrong,
//       console.error(
//         `Backend returned code ${error.status}, ` +
//         `body was: ${error.error}`);
//       this.noNetwork = error.status == 0;

//       if (error.status == 500) {
//         console.log('token expired, need to login again');
//         this.events.publish('token-expire');
//       }
//     }
//     // return an ErrorObservable with a user-facing error message
//     return new ErrorObservable('Something bad happened; please try again later.');
//   };

//   getRequest(url: string) {
//     this.log(`in getRequest and the user is`, this.user.access_token);
//     let headers = new HttpHeaders();
//     headers = headers.append('Authorization', this.user.access_token);
//     // headers = headers.append('Authorization', this.user ? this.user.access_token : 'my-access-token');
//     headers = headers.append("Content-Type", "application/x-www-form-urlencoded");

//     return this.http.get<any>(url, { headers: headers })
//       .pipe(
//         retry(1),
//         catchError(this.handleError),
//     );
//   }

//   postRequest(url: string, data: any) {
//     this.log(`in postRequest and the this.user is`, this.user);
//     const httpOptions = {
//       headers: new HttpHeaders({
//         "content-type": "application/x-www-form-urlencoded",
//         'Authorization': "Bearer " + this.user ? this.user.access_token : 'my-access-token',
//       })
//     };

//     return this.http.post<any>(url, data, httpOptions)
//       .pipe(
//         retry(2),
//         catchError(this.handleError),
//     );
//   }

//   postRequestUnauthorize(url: string, data: any) {

//     this.log(`in postRequestUnauthorize and the data is`, data);

//     return this.http.post<any>(url, data, {
//       headers: new HttpHeaders({
//         "Content-Type": "application/x-www-form-urlencoded",
//       })
//     })
//       .pipe(
//         retry(2),
//         catchError(this.handleError),
//     );
//   }

//   putRequest(url: string, data: any) {
//     this.log(`in putRequest and the this.user is`, this.user);
//     const httpOptions = {
//       headers: new HttpHeaders({
//         "content-type": "application/x-www-form-urlencoded",
//         'Authorization': "Bearer " + this.user ? this.user.access_token : 'my-access-token',
//       })
//     };

//     return this.http.put<any>(url, data, httpOptions)
//       .pipe(
//         retry(2),
//         catchError(this.handleError),
//     );
//   }

//   showMessage(message: string, duration: number = 2000, position: string = 'top') {
//     this.toastCtrl.create({
//       message: message,
//       duration: duration,
//       position: position,
//       showCloseButton: false,
//     }).present();
//   }

//   showLoader(msg?) {
//     this.loader = this.loadingCtrl.create({
//       content: msg ? msg : 'Loading..',
//       dismissOnPageChange: true
//     });
//     this.loader.present().catch(res => { console.log("exception in show loader") });
//   }

//   hideLoader() {
//     try {
//       this.loader.dismiss()
//         .then(res => {
//           // this.loader = null;
//           console.log("loader hide done", res);
//         })
//         .catch(err => {
//           console.log("exception in loader hide", err);
//           setTimeout(v => { this.hideLoader(); }, 100)
//         });
//     }
//     catch (e) { }
//   }

// log(message?: any, ...optionalParams: any[]): void {
//   console.log(message, ...optionalParams);
//   // console.log(JSON.stringify(message));
//   // console.log(JSON.stringify(optionalParams));
// }
// }




// import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  RequestOptions,
  Headers,
  Request,
  RequestMethod
} from "@angular/http";
import { Observable, Subject } from "rxjs/Rx";
import { ToastController, Loading, LoadingController, Events } from "ionic-angular";

import "rxjs/Rx";
import "rxjs/add/operator/map";
import * as Rx from "rxjs/Rx";

declare var FB: any;

@Injectable()
export class GlobalProvider {
  //======== base path ========//
  public base_path: string;
  public img_path: string;

  //======== API ========//
  public headers: Headers;
  public requestoptions: RequestOptions;
  public res: Response;
  public serverError: boolean;
  public noInternetError: boolean;
  private loader: Loading;

  public client_id: string = 'E3FDE09D-030C-4E78-B548-9888BF44';
  public client_secret: string = 'my-secret';
  public grant_type: string = 'password';
  public noNetwork: boolean = false;

  public user = JSON.parse(localStorage.getItem('user'));

  constructor(
    public http: Http,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private events: Events,
  ) {
    //testing server
    // this.base_path = 'http://private-amnesiac-bf0d54-eventonline.apiary-proxy.com/';

    //live server
    this.base_path = 'http://eventonline.info:3500/';
  }

  public getRequsetOptions(url: string): RequestOptions {
    if (localStorage.getItem("token")) {
      this.headers = new Headers();
      this.headers.append("Content-Type", "application/x-www-form-urlencoded");
      this.headers.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    }

    this.requestoptions = new RequestOptions({
      method: RequestMethod.Get,
      url: url,
      headers: this.headers
    });

    return this.requestoptions;
  }

  public getRequsetOptionsUnauthorised(url: string): RequestOptions {
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");

    this.requestoptions = new RequestOptions({
      method: RequestMethod.Get,
      url: url,
      headers: this.headers
    });

    return this.requestoptions;
  }

  public GetRequest(url: string): any {
    return this.http
      .request(new Request(this.getRequsetOptions(url)))
      .map((res: Response) => {
        let jsonObj: any;
        if (res.status === 204) {
          jsonObj = null;
        } else if (res.status === 500) {
          jsonObj = null;
        } else if (res.status !== 204) {
          jsonObj = res.json();
        }
        return [{ status: res.status, json: jsonObj }];
      })
      .catch(error => {
        if (error.status === 0) {
          this.noInternetError = true;
          return Observable.throw(error);
        } else {
          this.serverError = true;
          return Observable.throw(error);
        }
      });
  }

  public GetRequestUnauthorised(url: string): any {
    return this.http
      .request(new Request(this.getRequsetOptionsUnauthorised(url)))
      .map((res: Response) => {
        let jsonObj: any;
        if (res.status === 204) {
          jsonObj = null;
        } else if (res.status === 500) {
          jsonObj = null;
        } else if (res.status !== 204) {
          jsonObj = res.json();
        }
        return [{ status: res.status, json: jsonObj }];
      })
      .catch(error => {
        return Observable.throw(error);
      });
  }

  public PostRequest(url: string, data: any): any {
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    this.requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: this.headers,
      body: JSON.stringify(data)
    });

    return this.http
      .request(new Request(this.requestoptions))
      .map((res: Response) => {
        if (res) {
          return [{ status: res.status, json: res.json() }];
        }
      })
      .catch(error => {
        return Observable.throw(error);
      });
  }

  public PostRequestUnauthorised(url: string, data: any): any {
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");

    this.requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: this.headers,
      body: JSON.stringify(data)
    });

    return this.http
      .request(new Request(this.requestoptions))
      .map((res: Response) => {
        if (res) {
          return [{ status: res.status, json: res.json() }];
        }
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  public DeleteRequest(url: string): any {
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    this.requestoptions = new RequestOptions({
      method: RequestMethod.Delete,
      url: url,
      headers: this.headers
    });

    return this.http
      .request(new Request(this.requestoptions))
      .map((res: Response) => {
        if (res) {
          return [{ status: res.status, json: res.json() }];
        }
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  public PutRequest(url: string, data: any): any {
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    this.requestoptions = new RequestOptions({
      method: RequestMethod.Put,
      url: url,
      headers: this.headers,
      body: JSON.stringify(data)
    });

    return this.http
      .request(new Request(this.requestoptions))
      .map((res: Response) => {
        if (res) {
          return [{ status: res.status, json: res.json() }];
        }
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  showMessage(msg, duration?) {
    let finalDuration = 3000;
    if (duration)
      finalDuration = duration;
    let toast = this.toastCtrl.create({
      message: msg,
      duration: finalDuration,
      position: 'top'
    });
    toast.present();
  }

  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
    // console.log(JSON.stringify(message));
    // console.log(JSON.stringify(optionalParams));
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
}