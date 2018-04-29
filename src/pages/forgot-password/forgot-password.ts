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
      let data = { email: this.forgetPasswordForm.controls['emailORusername'].value };
      this.global.showLoader();
      this.global.putRequest(`${this.global.base_path}api/v1/user/reset?email=${this.forgetPasswordForm.controls['emailORusername'].value}`, null)
        .subscribe(res => {
          this.global.hideLoader();
          this.global.log('reset password response', res);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 200);
        }, err => {
          this.global.log('reset password error', err);
          this.global.hideLoader();
        });

    } else {
      this.isFormInvalid = true;
    }
  }
}
