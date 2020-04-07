import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-verify-email',
  templateUrl: 'verify-email.html',
})
export class VerifyEmailPage {
  showSpinner: boolean = false;
  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public authProvider: AuthProvider,
     public userProvider: UserProvider,
     public toastProvider: ToastProvider,
     public alertCtrl: AlertController,
     public platform: Platform,
     public statBar: StatusBar) {
  }

  ionViewDidLoad() {
    this.platform.ready().then( () => {
      //this.statBar.overlaysWebView(true);
      this.statBar.backgroundColorByHexString('#cccccc');
    });
  }

  resend(){
    this.showSpinner = true;
    this.authProvider.sendEmailVerificationLink().then(() => {
      this.showSpinner = false;
      this.toastProvider.presentToast('Verification link sent (Check spam folder in case you did not receive link).', 3000, 'top');
    }).catch(error => {
      this.showSpinner = false;
      this.toastProvider.presentToast('Try again later (Check spam folder in case you did not receive link).', 3000, 'top');
    })
  }

  logOut(){
    this.showSpinner = false;
    this.authProvider.signOut().then(() => {
      this.showSpinner = false;
    }).catch(error => {
      this.toastProvider.presentToast('Somethig went wrong.', 3000, 'top');
      this.showSpinner = false;
    })
  }

  changeAccount(){
    const confirm = this.alertCtrl.create({
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.logOut();
          }
        }
      ]
    });
    confirm.present();
  }

  refresh(){    
    window.location.reload();
  }

}
