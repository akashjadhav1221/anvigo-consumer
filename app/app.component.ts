import { Component, OnDestroy } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Network } from '@ionic-native/network';

//FIREBASE
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
//LIBRARIES
import { ISubscription } from 'rxjs/Subscription';
//CONSTANTS
import { MessageConstants } from '../common/constants/MessageConstants';
import { CollectionConstants } from '../common/constants/CollectionConstants';

//PROVIDERS
import { UserProvider } from '../providers/user/user';
import { ToastProvider } from '../providers/toast/toast';
import { FcmProvider } from '../providers/fcm/fcm';
import { CommonProvider } from '../providers/common/common';

@Component({
  templateUrl: 'app.html'
})

export class MyApp implements OnDestroy {

  rootPage: string = '';
  showSplash = true;
  private userObserver: ISubscription;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private afAuth: AngularFireAuth,
    private toastProvider: ToastProvider,
    private userProvider: UserProvider,
    private afs: AngularFirestore,
    public storage: Storage,
    private screenOrientation: ScreenOrientation,
    private fcmProvider: FcmProvider,
    public toastController: ToastController,
    public network: Network,
    public commonProvider: CommonProvider
    ) {
    try {

      this.userObserver = this.afAuth.authState.subscribe(user => {
        if (user) {
          console.log('User', user);
          this.userProvider.setUser(user);
          if (!user.emailVerified) {
            console.log('email not verified app component');

            this.rootPage = 'VerifyEmailPage';
            this.hideSplashScreen();
            // user.sendEmailVerification().then(success => {
            //   this.toastProvider.presentToastWithCloseBtn(MessageConstants.EMAIL_VERIFICATION_LINK_SENT, 'top', 'Okay');
            //   this.afAuth.auth.signOut();
            // }).catch(error => {
            //   console.log(error);
            // });
            
          } else {
            console.log('email verified app component');
            this.getUserDoc(user);
          }
        } else {
          this.rootPage = 'LoginPage';
          this.hideSplashScreen();
          console.log('No user');
        }
      }, error => {
        console.log(error);
      })
    } catch (error) {
      console.log(error);
      this.rootPage = 'LoginPage';
      this.hideSplashScreen();
    }

    platform.ready().then(() => {
      
      //this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#6e001f');

      this.network.onchange().subscribe(change => {
        console.log('change', change);
        if(change.type === 'offline'){
          this.commonProvider.isOnline  = false;

        }else if(change.type === 'online'){
          this.commonProvider.isOnline = true;
        }
      });

      setTimeout(() => {
        if (this.network.type === 'none') {
          this.commonProvider.isOnline = false;
          this.rootPage = 'InfoPage';
          this.showSplash = false;
          this.presentToast('You are offline');
        }
      }, 3000);

      if(platform.is('android')){
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.notificationSetup();
      }
      //statusBar.styleDefault();
      splashScreen.hide();

    });
  }

  getUserDoc(user: any) {
    let ref = this.afs.collection(CollectionConstants.USERS).doc(user.uid).ref;
    ref.get().then(doc => {
      if (doc.exists) {
        if(doc.data().role === 'consumer'){
          this.userProvider.setUserDoc(doc.data());
          console.log('data', this.userProvider.getUserDoc());
          this.rootPage = 'HomePage';
          this.hideSplashScreen();
          }else{
          this.showSplash = false;
          this.toastProvider.presentToastWithCloseBtn(MessageConstants.EMAIL_CONFLICT, 'top', 'Okay');
          this.userProvider.destroy();
          user.signOut();
        }
      } else {
        console.log('no user doc');
        this.rootPage = 'LocationPage';
        this.hideSplashScreen();
        }
    }).catch(error => {
      console.log(error);
      this.hideSplashScreen();
      this.toastProvider.presentToast(MessageConstants.SOMETHING_WENT_WRONG, 3000, 'top');
    });
  }

  ngOnDestroy() {
    if (this.userObserver && !this.userObserver.closed) {
      this.userObserver.unsubscribe();
    }
  }

  hideSplashScreen(){
    setTimeout(() => {
      this.showSplash = false;
    }, 1000);
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  private notificationSetup() {
    //this.fcmProvider.getToken();
    this.fcmProvider.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }

}



