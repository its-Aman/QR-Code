import { DatabaseProvider } from './../database/database';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Loading, Events } from 'ionic-angular';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

// declare var $: any;
@Injectable()
export class GlobalProvider {

  isTokenExpire: boolean = false;
  private loader: Loading;
  public base_path: string = localStorage.getItem('basepath');

  public interval: number;
  public currentTime: number;
  public exptoken: any;
  public isVerified: boolean;

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

  public language: string = localStorage.getItem('lang');

  ScanQRCodes: string;
  SyncToServer: string;
  CleanEventData: string;
  ChangeEvent: string;
  Setting: string;
  Signout: string;
  Search: string;
  SearchAttendants: string;
  Ticket: string;
  Checked: string;
  Remaining: string;
  TheScannedQRCodeDoesntExistHere: string;
  PleaseSyncWithServerOrContactSupport: string;
  UnrecognizedTicket: string;
  ResetYourPassword: string;
  ToResetYourPassword: string;
  Username: string;
  UsernameIsRequired: string;
  Reset: string;
  YoullReceiveAnEmailContainingLink: string;
  Login: string;
  Email: string;
  Password: string;
  EmailIsRequired: string;
  NotAValidEmail: string;
  PasswordIsRequired: string;
  IForgotMyPassword: string;
  LoginSuccessfull: string;
  DataClearedSuccessfully: string;
  PleaseSelectASoundInSettings: string;
  TheAppNeedsTheCameraToScanQRCodes: string;
  NotChecked: string;
  NoAttendeesFound: any;
  NoEventSelected: string;
  SelectActiveEvent: string;
  SelectEvent: string;
  EventIsRequired: string;
  Next: string;
  WirelessNetworks: string;
  ChangeMyPassword: string;
  ChangeLanguage: string;
  SoundNotifications: string;
  ChangeBasePath: string;
  MuteSound: string;
  ChangeSound: string;
  Change: string;
  TypeBasepath: string;
  ServerMessage: string;
  SynchronizationSuccessfull: string;
  Error: string;
  ThereHasBeenErrorsTryingToSync: string;
  Alert: string;
  NoUserToSync: string;
  ChooseLanguage: string;
  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private db: DatabaseProvider,
  ) {
    console.log('Hello GlobalProvider Provider');
    this.refreshTokenLogic();


    //testing server
    // this.base_path = 'http://private-amnesiac-bf0d54-eventonline.apiary-proxy.com/';

    //live server
    // this.base_path = 'http://eventonline.info:3500/';
  }

  private handleError(error: HttpErrorResponse) {
    console.log('handleError error is', error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.cLog('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.cLog(
        `Backend returned code `, error.status +
        `body was: `, error.error);
      this.noNetwork = error.status == 0;

      if (error.status == 500) {
        this.cLog('server error');
      } else if (error.error.code == 400 && error.error.error == "Access token expired") {
        this.cLog(`token expire and the status is 400, need to login`);
        this.events.publish('token-expire');
      } else if (error.status == 401) {
        this.cLog('token expired, need to login again');
        this.isTokenExpire = true;
        // this.getToken();
        this.alertFunc();
      } else {
        this.isTokenExpire = false;
      }
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(error.error);
  };

  getRequest(url: string) {
    let headers = new HttpHeaders()
      .set('Authorization', "Bearer " + this.getToken())
      .set('Content-Type', 'application/json');

    this.cLog(`in getRequest and the user is`, this.user_credentials, headers);

    return this.http.get<any>(url, { headers: headers })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err)),
    );
  }

  postRequest(url: string, data: any) {
    this.cLog(`in postRequest and the this.user is`, this.user_credentials);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + this.getToken(),
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(url, data, httpOptions)
      .pipe(
        retry(1),
        catchError(err => this.handleError(err)),
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
        catchError(err => this.handleError(err)),
    );
  }

  putRequest(url: string, data: any) {
    this.cLog(`in putRequest and the this.user is`, this.user_credentials);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + this.getToken(),
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(url, data, httpOptions)
      .pipe(
        retry(1),
        catchError(err => this.handleError(err)),
    );
  }

  putRequestUnauthorize(url: string, data: any) {
    this.cLog(`in putRequest and the this.user is`, this.user_credentials);
    const httpOptions = {
      // 'Authorization': "Bearer " + this.getToken(),
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<any>(url, data, httpOptions)
      .pipe(
        retry(1),
        catchError(err => this.handleError(err)),
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
    this.cLog(`in get token`, this.user_credentials);

    if (this.isTokenExpire) {
      this.cLog(`token is expired getting refresh token`);
      this.http.post(this.base_path + 'oauth2/refresh', `client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=refresh_token&refresh_token=${this.user_credentials.refresh_token}`, { headers: { 'Content-Type': 'application/json' } })
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


  refreshTokenLogic() {
    this.interval = setInterval(() => {
      if (JSON.parse(localStorage.getItem("login-response"))) {
        this.alertFunc();
      }
    }, 1000);
  }

  alertFunc() {
    // console.log("aaaaaa")
    let token = JSON.parse(localStorage.getItem("login-response"));
    let data = `client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=refresh_token&refresh_token=${token.refresh_token}`;

    if (token.access_token != null) {
      if (this.isTokenExpire && this.isVerified == false) {
        console.log("yes............");
        this.isVerified = true;

        this.postRequest(this.base_path + 'oauth2/refresh', data).subscribe((res) => {
          console.log("yes----------", res);
          this.isVerified = false
          localStorage.setItem("login-response", res);
        });
      }
      this.exptoken = token.expires_in;
      this.currentTime = Math.floor((Date.now()) / 1000);

      this.cLog("expire token", this.exptoken);

      if (this.currentTime == this.exptoken - 20) {
        console.log("token is expired");

        this.postRequest(this.base_path + 'oauth2/refresh', data).subscribe((res) => {
          console.log("yes----------", res);
          localStorage.setItem("login-response", res);
        });
      }
      else {
        // console.log("token is not expired ")
      }
    }
    else {
      // console.log("token not found")
    }
  }

  // public isValidDate(d: any) {

  //   if (!d) {
  //     return false;
  //   } else {
  //     return (d instanceof Date) && (!isNaN(d)) ;
  //   }
  // }

  reflectchangedLanguage() {
    if (this.language == 'en') {

      this.ScanQRCodes = `Scan QR Codes`;
      this.SyncToServer = `Sync to server`;
      this.CleanEventData = `Clean Event Data`;
      this.ChangeEvent = `Change Event`;
      this.Setting = `Setting`;
      this.Signout = `Sign out`;
      this.Search = `Search`;
      this.SearchAttendants = `Search Attendants`;
      this.Ticket = `Ticket`;
      this.Checked = `Checked`;
      this.Remaining = `Remaining`;
      this.TheScannedQRCodeDoesntExistHere = `The scanned QRCode doesn't exist here.`;
      this.PleaseSyncWithServerOrContactSupport = `Please sync with server or contact support.`;
      this.UnrecognizedTicket = `Unrecognized ticket`;
      this.ResetYourPassword = `Reset your password`;
      this.ToResetYourPassword = `To reset your password, we will send to your email, a link with which you can create a new password. Then you can use it here`;
      this.Username = `Username`;
      this.UsernameIsRequired = `Username is required`;
      this.Reset = `Reset`;
      this.YoullReceiveAnEmailContainingLink = ` You'll receive an email containing link to generate new password.`;
      this.Login = `Login`;
      this.Email = `Email`;
      this.Password = `Password`;
      this.EmailIsRequired = `Email is Required`;
      this.NotAValidEmail = `Not a valid email`;
      this.PasswordIsRequired = `Password is Required`;
      this.IForgotMyPassword = `I forgot my password`;
      this.LoginSuccessfull = `Login successfull!!!`;
      this.DataClearedSuccessfully = `Data Cleared Successfully`;
      this.PleaseSelectASoundInSettings = `Please select a sound in settings`;
      this.TheAppNeedsTheCameraToScanQRCodes = `The app needs the camera to scan QR codes`;
      this.NotChecked = `not checked`;
      this.NoAttendeesFound = `No attendees found!`;
      this.NoEventSelected = `No Event Selected`;
      this.SelectActiveEvent = `Select active event`;
      this.SelectEvent = `Select event`;
      this.EventIsRequired = `Event is Required`;
      this.Next = `Next`;
      this.WirelessNetworks = `Wireless & networks`;
      this.ChangeMyPassword = `Change my password`;
      this.ChangeLanguage = `Change language`;
      this.SoundNotifications = `Sound & Notifications`;
      this.ChangeBasePath = `Change Base Path`;
      this.MuteSound = `Mute Sound`;
      this.ChangeSound = `Change Sound`;
      this.Change = `Change`;
      this.TypeBasepath = `Type basepath`;
      this.ServerMessage = `Server Message`;
      this.SynchronizationSuccessfull = `Synchronization successfull`;
      this.Error = `Error`;
      this.ThereHasBeenErrorsTryingToSync = `There has been errors trying to sync. Check with your administrator`;
      this.Alert = `Alert`;
      this.NoUserToSync = `No User to sync`;
      this.ChooseLanguage = `Choose Language`;

    } else {

      this.ScanQRCodes = `Escanear códigos QR`;
      this.SyncToServer = `servidor`;
      this.CleanEventData = `Borrar datos evento`;
      this.ChangeEvent = `Cambiar evento`;
      this.Setting = `Configuracion`;
      this.Signout = `Salir`;
      this.Search = `Buscar`;
      this.SearchAttendants = `Buscar asistentes`;
      this.Ticket = `Entrada`;
      this.Checked = `Ingresado`;
      this.Remaining = `Faltan`;
      this.TheScannedQRCodeDoesntExistHere = `El código QR no existe en la lista`;
      this.PleaseSyncWithServerOrContactSupport = `Por favor, sincronice al servidor o contacte soporte`;
      this.UnrecognizedTicket = `Entrada no reconocida`;
      this.ResetYourPassword = `Reiniciar contraseña`;
      this.ToResetYourPassword = `Para cambiar su contraseña, le enviaremos a su email, un link con el cual puede crear una contraseña nueva. Luego puede usarla aquí`;
      this.Username = `Usuario`;
      this.UsernameIsRequired = `Usuario es Obligatorio`;
      this.Reset = `Reiniciar`;
      this.YoullReceiveAnEmailContainingLink = `Recibirá un correo con una URL para generar una nueva contraseña`;
      this.Login = `Ingreso`;
      this.Email = `Correo`;
      this.Password = `Contraseña`;
      this.EmailIsRequired = `El correo es obligatorio`;
      this.NotAValidEmail = `No es un correo válido`;
      this.PasswordIsRequired = `Contraseña es obligatorio`;
      this.IForgotMyPassword = `Olvidé mi contraseña`;
      this.LoginSuccessfull = `Ingreso exitoso!!!`;
      this.DataClearedSuccessfully = `Datos borrados con éxito`;
      this.PleaseSelectASoundInSettings = `Por favor seleccione un sonido`;
      this.TheAppNeedsTheCameraToScanQRCodes = `Se necesita la cámara para escanear códigos `;
      this.NotChecked = `No ingresado`;
      this.NoAttendeesFound = `No existen asistentes!`;
      this.NoEventSelected = `No hay evento seleccionado`;
      this.SelectActiveEvent = `Seleccione un evento activo`;
      this.SelectEvent = `Seleccione un evento`;
      this.EventIsRequired = `Evento es obligatorio`;
      this.Next = `Próximo`;
      this.WirelessNetworks = `Redes`;
      this.ChangeMyPassword = `Cambiar mi contraseña`;
      this.ChangeLanguage = `Cambiar lenguaje`;
      this.SoundNotifications = `Sonidos y notificaciones`;
      this.ChangeBasePath = `Cambiar Ruta Base`;
      this.MuteSound = `Sin sonido`;
      this.ChangeSound = `Cambiar Sonido`;
      this.Change = `Cambiar`;
      this.TypeBasepath = `Escriba ruta base`;
      this.ServerMessage = `Mensaje del Servidor`;
      this.SynchronizationSuccessfull = `Sincronizado con éxito`;
      this.Error = `Se produjeron errores al sincronizar| Consulte su administrador`;
      this.ThereHasBeenErrorsTryingToSync = `Error`;
      this.Alert = `Ningún usuario para sincronizar`;
      this.NoUserToSync = `Alerta`;
      this.ChooseLanguage = `Elija un idioma`;
    }
  }
}
