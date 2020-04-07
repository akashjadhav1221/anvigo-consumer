import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast/toast';
import { CommonProvider } from '../../providers/common/common';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string = '';
  password: string = '';
  showSpinner: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    public toastProvider: ToastProvider,
    public commonProvider: CommonProvider,
    public platform: Platform,
    public statBar: StatusBar) {
  }

  ionViewDidLoad() {
    this.platform.ready().then( () => {
      //this.statBar.overlaysWebView(true);
      this.statBar.backgroundColorByHexString('#cccccc');
    });
  }

  loginUser() {
    this.showSpinner = true;
    this.authProvider.loginUserWithEmail(this.email, this.password)
      .then(user => {
        this.showSpinner = false;
      }).catch(error => {
        console.log(error.message);
        this.showSpinner = false;
        this.toastProvider.presentToast(error.message, 3000, 'top');
      })
  }

  resetPasswordPage() {
    this.navCtrl.push('ResetPasswordPage');
  }

  signUpPage() {
    this.navCtrl.push('SignupPage');
  }

  validate() {
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    if (this.email.trim() === '') {
      this.toastProvider.presentToast('Email cannot be empty.', 3000, 'top');
      return;
    } else if (this.password.trim() === '') {
      this.toastProvider.presentToast('Password cannot be empty.', 3000, 'top');
      return;
    }
    else {
      this.loginUser();
    }
  }

}
