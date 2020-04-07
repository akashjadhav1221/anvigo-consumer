import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { OrdersProvider } from '../../providers/orders/orders';
import { ToastProvider } from '../../providers/toast/toast';
import { CommonProvider } from '../../providers/common/common';
import { FcmProvider } from '../../providers/fcm/fcm';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  showSpinner: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProvider: UserProvider,
    public ordersProvider: OrdersProvider,
    public toastProvider: ToastProvider,
    public commonProvider: CommonProvider,
    public fcmProvider: FcmProvider,
    public platform: Platform,
    public statBar: StatusBar,
    public app: App) {
    
  }

  ionViewDidLoad() {
    
    this.platform.ready().then( () => {
      //this.statBar.overlaysWebView(true);
      this.statBar.backgroundColorByHexString('#6e001f');
    });

    console.log('ionViewDidLoad HomePage');
    setTimeout(()=> {
     this.ordersProvider.getOrders();
    }, 1000);
    this.fcmProvider.getToken();
  }

  orderMonthlyGrocery(){
    if(!this.commonProvider.isOnline){
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    this.app.getRootNav().push('GroceryPage');
    // this.navCtrl.push();
  }

  openAccountPage(){
    console.log('account');
    this.navCtrl.push('AccountPage');
  }

  showOrdersPage(){
    if(!this.commonProvider.isOnline){
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    this.ordersProvider.paginate();
    this.navCtrl.push('OrdersPage', {
      component: 'order-list'
    });
  }

  showOrderDetails(order){
    this.navCtrl.push('OrdersPage', {
      component: 'order-details',
      order: order
    });
  }

  showOffersPage(){
    if(!this.commonProvider.isOnline){
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    this.navCtrl.push('OffersPage');
  }



}
