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
    public global: GlobalProvider
  ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
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
      this.navCtrl.setRoot('SelectActiveEventPage', {data: null});
    } else {
      this.isFormInvalid = true;
    }
  }
}
