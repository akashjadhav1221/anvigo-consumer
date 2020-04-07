import { NavController, NavParams, IonicPage, Navbar } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { CollectionConstants } from '../../common/constants/CollectionConstants';
import { FieldConstants } from '../../common/constants/FieldConstants';
import { Component, ViewChild } from '@angular/core';
import * as geofirex from 'geofirex';
import firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastProvider } from '../../providers/toast/toast';
import { ISubscription } from "rxjs/Subscription";
import { CallNumber } from '@ionic-native/call-number';
import { AngularFirestore } from 'angularfire2/firestore';
import { CommonProvider } from '../../providers/common/common';
// import { LocationAccuracy } from '@ionic-native/location-accuracy';
// import { Geolocation } from '@ionic-native/geolocation';


const geo = geofirex.init(firebase);

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public toastProvider: ToastProvider,
    private callNumber: CallNumber,
    public afs: AngularFirestore,
    public commonProvider: CommonProvider
    // private locationAccuracy: LocationAccuracy,
    // private geolocation: Geolocation,
) {
  }
  offers: any =[];
  radiusValue: number = 3;
  radius = new BehaviorSubject(3);
  showSpinner: boolean = true;
  showPaginationSpinner: boolean = false;
  showList: boolean = true;
  showOffer: any;
  private subscription: ISubscription;
  component: string = 'offers-list';
 
  showSearchSpinner: boolean = false;
  searchResults: any = [];
  query: string;
  queryLimit: number = 10;
  lastVisibleDoc: any;
  showSearchPaginationSpinner: boolean = false;
  showLoadMoreBtn: boolean = false;
  showNoResultsText: boolean = false;

  customLat: any;
  customLong: any;
  
  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      if(this.component === 'offer-details'){
        this.component = 'offers-list';
      }else if(this.component === 'search'){
        this.component = 'offers-list';     
      }else if(this.component === 'search-offer-details'){
        this.component = 'search';
      }
      else{
        this.navCtrl.pop();
      }
     }
    if(this.userProvider.userDoc.location)
    this.getOffers(this.userProvider.userDoc.location.geopoint._lat, this.userProvider.userDoc.location.geopoint._long);
    else
    this.getOffers(null, null);
  }

  getOffers(lat, long){
    this.showSpinner = true;
    let center;
    if(lat && long){
      center = geo.point(lat, long);
    }else{
      center = geo.point(18.626076, 73.812157);
    }
    const field = 'position';
    const offersCollection = geo.collection(CollectionConstants.OFFERS, ref =>
      ref.where(FieldConstants.STATUS, '==', 'Approved')
        .where(FieldConstants.IS_ACTIVE, '==', true)
    );
    let results = this.radius.pipe( 
      switchMap(r => {
        return offersCollection.within(center, r, field);
      })
    );

    this.subscription = results.subscribe(data => {
        this.offers = data;
        this.showSpinner = false;
        setInterval(() => {
          this.showPaginationSpinner = false;
        }, 1500);
    }, error => {
      console.log(error.message);
      this.showSpinner = false;
      this.showPaginationSpinner = false;
      this.toastProvider.presentToast('Something went wrong. Try again later', 3000, 'top');
    });
  }

  updateRadius(){
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    console.log(this.radiusValue);
    this.showPaginationSpinner = true;
    this.radiusValue = this.radiusValue + 3;
    this.radius.next(this.radiusValue);
  }

  offerSelected(offer){
    this.showOffer = null;
    this.showOffer = offer;
    this.component = 'offer-details';
  }

  ionViewDidLeave(){
    console.log('ion-leave');
    if(this.subscription && !this.subscription.closed){
      console.log('ion-leave unsbscribed');
      this.subscription.unsubscribe();
    }
  }

  ionViewDidUnLoad(){
    console.log('ion-unload');
    if(this.subscription && !this.subscription.closed){
      console.log('ion-unload unsbscribed');
      this.subscription.unsubscribe();
    }
  }

  makeCall(number: string) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  showSearch(){
    this.component = 'search';
  }

  onInput(event) {
    console.log(event, 'OnInput');
    if (!this.query || this.query.length === 0) {
      this.searchResults = [];
      return;
    }
    this.showNoResultsText = false;
    this.showSearchSpinner = true;
    this.query = this.query.toLocaleLowerCase().trim();
    this.searchResults = [];
    this.getSearchRef().get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length) {
          this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          if (querySnapshot.docs.length < this.queryLimit) {
            this.showLoadMoreBtn = false;
          } else {
            this.showLoadMoreBtn = true;
          }
          querySnapshot.forEach(doc => {
            let obj = {};
            obj = doc.data();
            obj['id'] = doc.id;
            this.searchResults.push(obj);
          });
          console.log('search-results', this.searchResults);
          this.showNoResultsText = false;
        }else{
          this.showLoadMoreBtn = false;
          this.showNoResultsText = true;
        }
        this.showSearchSpinner = false;
      }).catch(error => {
        console.log(error);
        this.toastProvider.presentToast('Something went wrong. Try again', 3000, 'top');
        this.showNoResultsText = true;
        this.showSearchSpinner = false;
        this.searchResults = [];
      })
  }

  getSearchRef() {
    let ref = this.afs.collection(CollectionConstants.OFFERS).ref;
    return ref.where(FieldConstants.KEYWORDS, 'array-contains', this.query)
    .limit(this.queryLimit);
  }

  onCancel(event) {
    console.log(event, 'onCancel');

    this.searchResults = [];
    console.log(this.searchResults);
  }
  
  queryChanged(){
    console.log('query Changed');
    if(this.query.trim().length === 0){
      this.searchResults = [];
    }
  }

  paginate(){
      this.showNoResultsText = false;
      this.showPaginationSpinner = true;
      this.showLoadMoreBtn = false;
      this.getSearchRef().startAfter(this.lastVisibleDoc).get()
      .then(querySnapshot => {

        if (querySnapshot.docs.length) {
          this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          if (querySnapshot.docs.length < this.queryLimit) {
            this.showLoadMoreBtn = false;
          } else {
            this.showLoadMoreBtn = true;
          }
          querySnapshot.forEach(doc => {
            if (doc.exists) {
              let obj = doc.data();
              obj['id'] = doc.id;
              console.log('obj', obj);
              this.searchResults.push(obj);
            }
          });
        } else {
          this.showLoadMoreBtn = false;
        }
        this.showSearchPaginationSpinner = false;
      }).catch(error => {
        this.toastProvider.presentToast('Something went wrong. Try again.', 3000, 'top');
        this.showSearchPaginationSpinner = false;
        this.showLoadMoreBtn = false;
      });
  }

  searchOfferSelected(offer){
    this.showOffer = null;
    this.showOffer = offer;
    this.component = 'search-offer-details';
  }

  // requestLocation() {
  //   try {
  //     this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //       () => {
  //         console.log('success');
  //         this.getGeoLocation();
  //       },
  //       error => {
  //         console.log('Error requesting location permissions', error);
  //         this.toastProvider.presentToast('Turn on GPS & allow Location Accuracy.', 3000, 'top');
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // getGeoLocation() {
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     this.customLat = resp.coords.latitude;
  //     this.customLong = resp.coords.longitude;
  //     if(this.customLat && this.customLong){
  //       this.getOffers(this.customLat, this.customLong);
  //       }else{
  //       this.toastProvider.presentToast('Something went wrong. Try again.', 3000, 'top');
  //     }
     
  //   }).catch((error) => {
  //     this.showSpinner = false;
  //     this.toastProvider.presentToast('Something went wrong.', 3000, 'top');
  //     console.log('Error getting location', error);
  //   });
  // }
}
