import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast/toast';
import { MessageConstants } from '../../common/constants/MessageConstants';
import { CommonProvider } from '../../providers/common/common';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  email: string = '';
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

  loginPage(){
    this.navCtrl.pop();
  }

  signUpPage(){
    this.navCtrl.pop().then(() => {
      this.navCtrl.push('SignupPage');
    });
  }

  resetPassword(){
    this.showSpinner = true;
    this.authProvider.resetPassword(this.email.trim())
    .then(success => {
      this.showSpinner = false;
      this.toastProvider.presentToast(MessageConstants.PASSWORD_RESET_LINK_SENT, 3000, 'top');
    }).catch(error => {
      this.showSpinner = false;
      this.toastProvider.presentToast(error.message, 3000, 'top');
    });
  }

  validate(){
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    if(this.email.trim() === ''){
       this.toastProvider.presentToast('Email cannot be empty.', 3000, 'top');
       return;
     }else{
       this.resetPassword();
     }
   }

}
