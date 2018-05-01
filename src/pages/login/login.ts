import { DatabaseProvider } from './../../providers/database/database';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

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
    this.global.log('forgot password');

    this.navCtrl.push('ForgotPasswordPage', { data: null });
  }

  openMenu() {
    this.global.log('Opening menu');
  }

  login() {
    this.global.log('Logging in', this.loginForm);

    if (this.loginForm.valid) {
      this.global.log('form is valid');
      let data = this.loginForm.value;
      data['client_id'] = this.global.client_id;
      data['client_secret'] = this.global.client_secret;
      data['grant_type'] = this.global.grant_type;

      this.global.log('data to be posted is ', data);
      this.global.showLoader();
      this.global.postRequestUnauthorize(this.global.base_path + 'oauth2/authorize', data)
        .subscribe(res => {
          this.global.hideLoader();
          this.global.log('api response', res);
          this.global.showMessage('Login successfull!!!');
          this.db.create('login-response', res).then(res => {
            setTimeout(() => {
              this.navCtrl.setRoot('SelectActiveEventPage', { data: null });
            }, 250);
          });
        }, err => {
          this.global.hideLoader();
          this.global.log('api response error', err);
        });

    } else {
      this.isFormInvalid = true;
    }
  }
}
