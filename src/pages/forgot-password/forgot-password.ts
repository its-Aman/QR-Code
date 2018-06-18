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
    this.global.cLog('Opening menu');
  }

  reset() {
    this.global.cLog('resetting password', this.forgetPasswordForm);

    if (this.forgetPasswordForm.valid) {
      let queryParams = `email=${this.forgetPasswordForm.controls['emailORusername'].value}&client_id=${this.global.client_id}&client_secret=${this.global.client_secret}`;
      this.global.cLog('resetting password form is valid', queryParams);
      this.global.showLoader();
      this.global.putRequestUnauthorize(`${this.global.base_path}api/v1/user/reset?${queryParams}`, null)
        .subscribe(res => {
          this.global.isTokenExpire = false;
          this.global.hideLoader();
          this.global.cLog('reset password response', res);
          this.global.showMessage(this.global.YoullReceiveAnEmailContainingLink, 3500);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 200);
        }, err => {
          this.global.cLog('reset password error', err);
          this.global.hideLoader();
          this.global.showMessage(err.error);
        });

    } else {
      this.isFormInvalid = true;
    }
  }
}
