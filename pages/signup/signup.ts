import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast/toast';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  displayName: string = '';
  email: string = '';
  password: string = '';
  showSpinner: boolean = false;
  confirmationDisplayed: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastProvider: ToastProvider,
    public authProvder: AuthProvider,
    public alertCtrl: AlertController,
    public commonProvider: CommonProvider,
    public platform: Platform,
    public statBar: StatusBar,
    ) {
  }

  ionViewDidLoad() {
    this.platform.ready().then( () => {
      //this.statBar.overlaysWebView(true);
      this.statBar.backgroundColorByHexString('#cccccc');
    });
  }

  loginPage(){
    if(this.showSpinner)
    return;
    
    this.navCtrl.pop();
  }

  signupUser(){
    this.showSpinner = true;
    try{
     this.authProvder.signUpUserWithEmail(this.email.trim(), this.password.trim())
     .then(user => {
        
      console.log('authObj', user);
        this.authProvder.setUserProfile(this.displayName.trim(), '')
        .then(success => {
          console.log('user profile set');
          this.authProvder.sendEmailVerificationLink().then(() => {
            console.log('link sent');
          }).catch(error => {
            console.log(error);
          });
  
        }).catch(error => {
          console.log(error);
        });

        this.showSpinner = false;
        //this.navCtrl.setRoot('LoginPage')

      }).catch(error => {
        this.showSpinner = false;
        console.log(error.message);
        this.toastProvider.presentToast(error.message, 3000, 'top');
      });
    }catch(error){
      this.showSpinner = false;
      console.log(error);
    }
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      message: 'I have read & accept the terms & privacy policy.',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.signupUser();
          }
        }
      ]
    });
    this.confirmationDisplayed = true;
    confirm.present();
  }

  privacyPolicy(){
      window.open("https://alienart.in/legal/privacy-anvigo-consumer/", '_system', 'location=yes');
  }

  validate(){
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    if(this.displayName.trim() === ''){
      this.toastProvider.presentToast('Name cannot be empty.', 3000, 'top');
      return;
    }else if(this.displayName.trim().length <= 2){
      this.toastProvider.presentToast('Name should contain atleast 3 characters.', 3000, 'top');
      return;
    }else if(this.email.trim() === ''){
      this.toastProvider.presentToast('Email cannot be empty.', 3000, 'top');
      return;
    }else if(this.password.trim() === ''){
      this.toastProvider.presentToast('Password cannot be empty.', 3000, 'top');
      return;
    }
    else if(this.password.trim().length <= 5){
      this.toastProvider.presentToast('Password should contain atleast 6 characters.', 3000, 'top');
      return;
    }else{
      //if(!this.confirmationDisplayed){
        this.showConfirm();
      // }else{
      //   this.signupUser();
      // }
    }
  }
}
