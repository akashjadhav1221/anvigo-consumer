
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../user/user';
import { ToastProvider } from '../toast/toast';
import { CollectionConstants } from '../../common/constants/CollectionConstants';

@Injectable()
export class FcmProvider {

  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform,
              private userProvider: UserProvider,
              public toastProvider: ToastProvider) {}

  public getToken() {

    if (this.platform.is('android')) {
      this.firebase.getToken().then(token => {
        this.saveToken(token);
      }).catch(error => {
        console.log('token post error');
      });
    }

    // if (this.platform.is('ios')) {
    //   token = await this.firebase.getToken();
    //   await this.firebase.grantPermission();
    // }

  }

  private saveToken(token) {
    if (!token) return;

    let devicesRef = this.afs.collection(CollectionConstants.DEVICES).ref;

    let obj = {
      token: token,
      userId: this.userProvider.user.uid,
      role: this.userProvider.userDoc.role
    };

    devicesRef.doc(obj.token).set(obj).then(success => {
      console.log('token posted');
    }).catch(error => {
      console.log('token post error');
    });
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
