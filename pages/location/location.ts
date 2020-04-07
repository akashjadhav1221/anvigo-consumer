import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
//FIREBASE
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import * as firebaseApp from 'firebase/app';
//CONSTANTS
import { CollectionConstants } from '../../common/constants/CollectionConstants';
//PLUGINS
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
//PROVIDERS
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';
//LIBRARIES
import * as geofirex from 'geofirex';
import { StatusBar } from '@ionic-native/status-bar';



@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  geo = geofirex.init(firebaseApp);
  showSpinner: boolean = true;
  lat: any;
  lng: any;
  loadingMsg: string;
  locationError: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public toastProvider: ToastProvider,
    public userProvider: UserProvider,
    public openNativeSettings: OpenNativeSettings,
    public platform: Platform,
    public statBar: StatusBar) {
    this.loadingMsg = 'Getting location...';
    console.log('Location page');
  }

  ionViewDidLoad() {
    console.log('location page');
    if (this.userProvider.getUser() != null) {
      this.requestLocation();
    }
    this.platform.ready().then( () => {
      //this.statBar.overlaysWebView(true);
      this.statBar.backgroundColorByHexString('#cccccc');
    });
  }

  requestLocation() {
    try {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          console.log('success');
          this.getGeoLocation();
        },
        error => {
          console.log('Error requesting location permissions', error);
          this.locationError = true;
          this.showSpinner = false;
          //For Web
          //this.getGeoLocation();
        }
      );
    } catch (error) {
      console.log(error);
      this.locationError = true;
      this.showSpinner = false;
    }
  }

  getGeoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      let location = this.getLocationHash();
      console.log('location', location);
      let userObject = this.createUserObject(location);
      console.log(userObject);

      this.saveUserDoc(userObject).then(success => {
        this.userProvider.setUserDoc(userObject);
        console.log('userDoccreated');
        this.showSpinner = false;
        this.navCtrl.setRoot('HomePage');
      }
      ).catch(error => {
        this.showSpinner = false;
        this.locationError = true;
        this.toastProvider.presentToast('Something went wrong.', 3000, 'top');
        console.log(error);
      });

    }).catch((error) => {
        this.showSpinner = false;
        this.locationError = true;
        this.toastProvider.presentToast('Something went wrong.', 3000, 'top');
        console.log(error);
    });
  }


  createUserObject(location: any) {
    return {
      role: 'consumer',
      timestamps: {
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      language: 'en',
      location: location,
      address: '',
      phoneNumber: '',
      email: this.userProvider.getUser().email,
    }
  }

  getLocationHash() {
    if (this.lat && this.lng) {
      const point = this.geo.point(this.lat, this.lng);
      console.log('geoPoint', point.data);
      return point.data;
    } else {
      console.log('Lat long not available');
      return;
    }
  }

  saveUserDoc(doc: any) {
    return this.afs.collection(CollectionConstants.USERS).doc(this.userProvider.user.uid).set(doc, { merge: true });
  }


  tryAgain() {
    if (this.userProvider.getUser() != null) {
      this.showSpinner = true;
      this.locationError = false;
      this.requestLocation();
    }
  }

  openSettings() {
    this.openNativeSettings.open('location')
      .then(success => {
        console.log('success');
      }).catch(error => {
        console.log(error);
      })
  }
}
