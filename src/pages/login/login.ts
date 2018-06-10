import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  isFormInvalid: boolean = false;

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
    console.log('ionViewDidLoad LoginPage');
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  forgotPassword() {
    this.global.cLog('forgot password');

    this.navCtrl.push('ForgotPasswordPage', { data: null });
  }

  openMenu() {
    this.global.cLog('Opening menu');
  }

  login() {
    this.global.cLog('Logging in', this.loginForm);

    if (this.loginForm.valid) {

      this.global.cLog('form is valid');

      let _data = `client_id=${this.global.client_id}&client_secret=${this.global.client_secret}&grant_type=${this.global.grant_type}&username=${this.loginForm.controls['username'].value.replace('@', '%40')}&password=${this.loginForm.controls['password'].value}`;

      // _data = `client_id=E3FDE09D-030C-4E78-B548-9888BF44&client_secret=my-secret&grant_type=password&username=smelgin%40gmail.com&password=andrescock`
      this.global.cLog(`data to be posted is`, _data);

      this.global.showLoader();
      this.global.postRequestUnauthorised(this.global.base_path + 'oauth2/authorize', _data)
        .subscribe(res => {
          this.global.isTokenExpire = false;
          this.global.hideLoader();
          this.global.cLog('api response', res);
          this.global.showMessage('Login successfull!!!');
          this.global.user_credentials = res;
          localStorage.setItem('login-response', JSON.stringify(res));
          this.db.create('login-response', res).then(res => {
            setTimeout(() => {
              this.navCtrl.setRoot('SelectActiveEventPage', { data: null });
            }, 250);
          });
        }, err => {
          this.global.hideLoader();
          this.global.cLog('api response error', err);
          this.global.showMessage(err.error);
        });

    } else {
      this.isFormInvalid = true;
    }
  }
}
