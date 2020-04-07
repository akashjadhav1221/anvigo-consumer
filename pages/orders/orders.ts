import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import { ToastProvider } from '../../providers/toast/toast';
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionConstants } from '../../common/constants/CollectionConstants';
import firebase from 'firebase';
import { CommonProvider } from '../../providers/common/common';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  @ViewChild(Navbar) navBar: Navbar;
  component : string = 'order-list';
  order: any;
  title: string = 'All Orders';
  fromHomePage: boolean = false;
  itemListVisible: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ordersProvider: OrdersProvider,
    public toastProvider: ToastProvider,
    public afs: AngularFirestore,
    public commonProvider: CommonProvider
  ) {
    this.component = navParams.get('component');
    console.log(this.component);
    if(this.component === 'order-details'){
      this.fromHomePage = true;
      this.title = 'Order Details';
      this.order = navParams.get('order');
    } 
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      if(this.component === 'order-details' && this.itemListVisible){
        this.itemListVisible = false;
      }
      else if(this.component === 'order-details' && this.fromHomePage){
        this.navCtrl.pop();
      }else if(this.component === 'order-details' && !this.fromHomePage){
        this.component = 'order-list';
        this.title = 'All Orders'
      }else if(this.component === 'order-list'){
        this.navCtrl.pop();
      }
     }
  }


  ionViewWillUnload() {
  }

  onOrderSelected(order){
    this.fromHomePage = false;
    console.log('orders page', order);
    this.order = order;
    this.component = 'order-details';
    this.title = 'Order Details';
  }

  onShowList(state){
    this.itemListVisible = state;
    console.log('item list visible', this.itemListVisible);
  }

  cancelOrder(order){
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    let orderSnap = this.ordersProvider.getOrderById(order.id);
    
    if(orderSnap[0].state === 'Approval Pending' || orderSnap[0].state === 'Accepted by store owner'){
       let ref = this.afs.collection(CollectionConstants.ORDERS).doc(order.id).ref;
       let obj = {};
      obj['state'] = 'Canceled by user';
      obj['timestamps'] = {
        canceledAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      ref.set(obj, {merge: true})
      .then(success => {
        this.toastProvider.presentToast('Order canceled.', 3000, 'top');
        this.component = 'order-list';
      }).catch(error => {
        this.toastProvider.presentToast('Something went wrong', 3000, 'top');
        this.component = 'order-list';
      })
    }else{
      this.toastProvider.presentToast('Something went wrong.', 3000, 'top');
      this.component = 'order-list';
    }

  }

  orderConfirm(order){
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    let orderSnap = this.ordersProvider.getOrderById(order.id);
    
    if(orderSnap[0].state === 'Accepted by store owner'){
      let obj = {};
      obj['state'] = 'Confirmed by user';
      obj['timestamps'] = {
        confirmedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      let ref = this.afs.collection(CollectionConstants.ORDERS).doc(order.id).ref;
      ref.set(obj, {merge: true})
      .then(success => {
        this.toastProvider.presentToast('Order confirmed.', 3000, 'top');
        this.component = 'order-list';
      }).catch(error => {
        this.toastProvider.presentToast('Something went wrong', 3000, 'top');
        this.component = 'order-list';
      })
    }else{
      this.toastProvider.presentToast('Something went wrong.', 3000, 'top');
      this.component = 'order-list';
    }

  }

}
