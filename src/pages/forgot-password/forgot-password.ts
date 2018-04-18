import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forgetPasswordForm: FormGroup;
  isFormInvalid: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider
  ) {
    this.initForm();
  }

  initForm() {
    this.forgetPasswordForm = this.fb.group({
      emailORusername: [null, [Validators.required]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  openMenu() {
    this.global.log('Opening menu');
  }

  reset() {
    this.global.log('resetting password', this.forgetPasswordForm);

    if (this.forgetPasswordForm.valid) {
      this.global.log('resetting password form is valid');
    } else {
      this.isFormInvalid = true;
    }
  }
}
