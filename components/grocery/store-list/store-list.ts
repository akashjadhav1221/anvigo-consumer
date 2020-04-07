import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../../../providers/user/user';
import { CollectionConstants } from '../../../common/constants/CollectionConstants';
import { BusinessCategoryConstants } from '../../../common/constants/BusinessCategoryConstants';
import { CommonProvider } from '../../../providers/common/common';
import { FieldConstants } from '../../../common/constants/FieldConstants';
import * as geofirex from 'geofirex';
import firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';
import { ToastProvider } from '../../../providers/toast/toast';
import { switchMap } from 'rxjs/operators';
// import { LocationAccuracy } from '@ionic-native/location-accuracy';
// import { Geolocation } from '@ionic-native/geolocation';


const geo = geofirex.init(firebase);

@Component({
  selector: 'store-list',
  templateUrl: 'store-list.html'
})
export class StoreListComponent {

  private subscription: ISubscription;
  showPaginationSpinner: boolean = false;
  radiusValue: number = 3;
  radius = new BehaviorSubject(3);
  stores: any;
  showSpinner: boolean;
  loadingMsg: string;
  showSearchResults: boolean;
  searchResults: any;
  query: string;
  queryLimit: number;
  callCompleted: boolean;
  customLat: any;
  customLong: any;
  //@Input() locationClicked: boolean;
  @Output() onStoreSelection = new EventEmitter();
  constructor(
    public afs: AngularFirestore,
    public userProvider: UserProvider,
    public commonProvider: CommonProvider,
    public toastProvider: ToastProvider,
    // private locationAccuracy: LocationAccuracy,
    // private geolocation: Geolocation,
  ) {
    this.loadingMsg = this.commonProvider.getLoadingTextAlternative();
    this.showSpinner = true;
    this.showSearchResults = false;
    this.searchResults = [];
    this.query = '';
    this.queryLimit = 10;

    if(this.userProvider.userDoc.location)
    this.getGroceryStores(this.userProvider.userDoc.location.geopoint._lat, this.userProvider.userDoc.location.geopoint._long);
    else
    this.getGroceryStores(null, null);
   
    //this.getGroceryStoresInRange();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('input changes', changes.locationClicked.currentValue);
  //   if(changes.locationClicked.currentValue)
  //   this.requestLocation()
  // }

  // getGroceryStoresInRange() {
  //   this.callCompleted = false;
  //   this.showSpinner = true;
  //   const businesses = geo.collection(CollectionConstants.BUSINESSES, ref =>
  //     ref.where(FieldConstants.BUSINESS_CATEGORY, '==', BusinessCategoryConstants.GROCERY_STORE)
  //       .where(FieldConstants.IS_ACTIVE, '==', true)
  //       .limit(this.queryLimit)
  //   );
  //   const center = geo.point(this.userProvider.userDoc.location.geopoint._lat, this.userProvider.userDoc.location.geopoint._long);
  //   const radius = 2;
  //   const field = 'position';
  //   const query = businesses.within(center, radius, field);
  //   query.subscribe(results => {
  //     this.stores = results;
  //     this.callCompleted = true;
  //     console.log('stores', this.stores);
  //     this.showSpinner = false;
  //   }, error => {
  //     this.callCompleted = true;
  //     this.showSpinner = false;
  //   });
  // }

  storeSelected(store) {
    console.log('selected store', store);
    this.onStoreSelection.emit(store);
  }

  onInput(event) {
    this.showSearchResults = false;
    if (!this.query || this.query.length === 0) {
      this.searchResults = [];
      return;
    }
    this.query = this.query.toLocaleLowerCase().trim();
    this.searchResults = [];
    this.getSearchRef().get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length) {
          querySnapshot.forEach(doc => {
            let obj = {};
            obj = doc.data();
            obj['id'] = doc.id;
            this.searchResults.push(obj);
          });
          console.log('search-results', this.searchResults);
        }
        this.showSearchResults = true;
      }).catch(error => {
        console.log(error);
        this.showSearchResults = true;
        this.searchResults = [];
      })
  }

  getSearchRef() {
    let ref = this.afs.collection(CollectionConstants.BUSINESSES).ref;
    return ref.where(FieldConstants.KEYWORDS, 'array-contains', this.query)
    .where(FieldConstants.BUSINESS_CATEGORY, '==', BusinessCategoryConstants.GROCERY_STORE)
    .where('isActive', '==', true)
    .limit(this.queryLimit);
  }

  onCancel(event) {
    this.showSearchResults = false;
    this.searchResults = [];
    console.log(this.searchResults);
  }

  ngOnDestroy() {
    console.log('onDestroy');
    if(this.subscription && !this.subscription.closed){
      console.log('ng-destroy unsbscribed');
      this.subscription.unsubscribe();
    }
  }

  queryChanged(){
    this.showSearchResults = true;
    if(this.query.trim().length === 0){
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  getGroceryStores(lat, long){
    this.callCompleted = false;
    this.showSpinner = true;

    let center;
    if(lat && long){
      center = geo.point(lat, long);
    }else{
      center = geo.point(18.626076, 73.812157);
    }
    const field = 'position';
    const businesses = geo.collection(CollectionConstants.BUSINESSES, ref =>
      ref.where(FieldConstants.BUSINESS_CATEGORY, '==', BusinessCategoryConstants.GROCERY_STORE)
        .where(FieldConstants.IS_ACTIVE, '==', true)
        .limit(this.queryLimit)
    );

    let results = this.radius.pipe( 
      switchMap(r => {
        return businesses.within(center, r, field);
      })
    );

    this.subscription = results.subscribe(data => {
        this.stores = data;
        this.showSpinner = false;
        this.callCompleted = true;
        setInterval(() => {
          this.showPaginationSpinner = false;
        }, 1500);
    }, error => {
      console.log(error.message);
      this.showSpinner = false;
      this.showPaginationSpinner = false;
      this.callCompleted = true;
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
  //       this.getGroceryStores(this.customLat, this.customLong);
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
