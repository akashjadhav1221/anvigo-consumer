import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserProvider } from '../../../providers/user/user';
import { CollectionConstants } from '../../../common/constants/CollectionConstants';
import { AlertController } from 'ionic-angular';
import { MessageConstants } from '../../../common/constants/MessageConstants';
import { CartProvider } from '../../../providers/cart/cart';
import { ToastProvider } from '../../../providers/toast/toast';
import { CommonProvider } from '../../../providers/common/common';

@Component({
  selector: 'deliver-type',
  templateUrl: 'deliver-type.html'
})
export class DeliverTypeComponent {
  @Input() selectedStore: any;
  @Output() onEditListClick = new EventEmitter();
  @Output() onOrderPost = new EventEmitter();

  isOrderPosted: boolean;
  deliveryMethod: string;
  selectedDeliveryMethod: string;
  mobileNumberUpdate: boolean;
  addressUpdate: boolean;
  mobileNumberCopy: string = '';
  addressCopy: string = '';
  showOrderSpinner: boolean;
  disableUI: boolean;
  constructor(
    public userProvider: UserProvider,
    public afs: AngularFirestore,
    private alertCtrl: AlertController,
    public cartProvider: CartProvider,
    public toastProvider: ToastProvider,
    public commonProvider: CommonProvider
  ) {
    this.deliveryMethod = '';
    this.showOrderSpinner = false;
    this.isOrderPosted = false;
    this.disableUI = false;
    if (this.userProvider.userDoc.phoneNumber && this.userProvider.userDoc.phoneNumber.trim() != '') {
      this.mobileNumberUpdate = false;
      this.mobileNumberCopy = this.userProvider.userDoc.phoneNumber;
    } else {
      this.mobileNumberUpdate = true;
    }

    if (this.userProvider.userDoc.address && this.userProvider.userDoc.address.trim() != '') {
      this.addressUpdate = false;
      this.addressCopy = this.userProvider.userDoc.address;
    } else {
      this.addressUpdate = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('input changes', changes.selectedStore.currentValue);
  }


  deliveryMethodChanged(event) {
    console.log(event);
    this.selectedDeliveryMethod = event === 'selfPickup' ? 'Self Pickup' : 'Home Delivery';
  }

  validateNumber(number) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return regex.test(number.trim());
  }

  disablePlaceOrder() {
    if (this.deliveryMethod === '') {
      return true;
    } else {
      if (this.deliveryMethod === 'selfPickup') {
        if (this.userProvider.userDoc.phoneNumber && this.userProvider.userDoc.phoneNumber.trim() != '') {
          return false;
        } else {
          return true;
        }
      } else if (this.deliveryMethod === 'homeDelivery') {
        if (this.userProvider.userDoc.phoneNumber && this.userProvider.userDoc.phoneNumber.trim() != '' &&
          this.userProvider.userDoc.address && this.userProvider.userDoc.address.trim() != '') {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  placeOrder() {
    if(this.userProvider.userDoc.phoneNumber.trim().length == 0){
      this.toastProvider.presentToast('Mobile number cannot be empty.', 3000, 'top');
      return;
    }else if(!this.validateNumber(this.userProvider.userDoc.phoneNumber)){
      this.toastProvider.presentToast('Invaild mobile number.', 3000, 'top');
      return;
    }else if(this.selectedDeliveryMethod === 'Home Delivery' && this.userProvider.userDoc.address.trim().length == 0){
      this.toastProvider.presentToast('Address cannot be empty.', 3000, 'top');
      return;
    }else if(this.selectedDeliveryMethod === 'Home Delivery' && this.userProvider.userDoc.address.trim().length < 10){
      this.toastProvider.presentToast('Address should contain atleast 10 characters.', 3000, 'top');
      return;
    }else{
      let obj = {};
    if (this.addressUpdate || this.userProvider.userDoc.address.trim() != this.addressCopy) {
      this.updateAddress().then(success => {
        console.log('address upated');
      }).catch(error => {
        console.log(error);
      });
    }

    if (this.mobileNumberUpdate || this.userProvider.userDoc.phoneNumber.trim() != this.mobileNumberCopy) {
      this.updatePhoneNumber().then(success => {
        console.log('phoneNumber Upated');
      })
    }
    this.presentConfirm();
    }
  }

  editOrder() {
    this.onEditListClick.emit(true);
  }

  updateAddress() {
    return this.afs.collection(CollectionConstants.USERS).doc(this.userProvider.user.uid)
      .update({ address: this.userProvider.userDoc.address.trim() });
  }


  updatePhoneNumber() {
    return this.afs.collection(CollectionConstants.USERS).doc(this.userProvider.user.uid)
      .update({ phoneNumber: this.userProvider.userDoc.phoneNumber.trim() });
  }

  presentConfirm() {
    if (!this.commonProvider.isOnline) {
      this.toastProvider.presentToast('You are offline.', 3000, 'top');
      return;
    }
    let alert = this.alertCtrl.create({
      title: MessageConstants.CONFIRM_ORDER,
      message: MessageConstants.ORDER_DISCLAIMER,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm Order',
          handler: () => {
            this.confirmOrder();
          }
        }
      ]
    });
    alert.present();
  }

  confirmOrder() {
    if(this.showOrderSpinner){
      return;
    }
    this.showOrderSpinner = true;
    this.disableUI = true;
    let orderObject = this.cartProvider.confirmGroceryOrder(this.selectedStore, this.selectedDeliveryMethod);
    if (orderObject) {
      let id = this.afs.createId();
      console.log(id);
      let collection = this.afs.collection(CollectionConstants.ORDERS);
      collection.add(orderObject)
        .then(success => {
          console.log('order object posted');
          this.onOrderPost.emit(true);
          this.isOrderPosted = true;
          this.cartProvider.groceryList = [];
        }).catch(error => {
          console.log('error posting order object', error);
          this.showOrderSpinner = false;
          this.disableUI = false;
          this.toastProvider.presentToast(MessageConstants.SOMETHING_WENT_WRONG, 3000, 'top');
        });
    } else {
      this.showOrderSpinner = false;
      this.disableUI = false;
      this.toastProvider.presentToast(MessageConstants.SOMETHING_WENT_WRONG, 3000, 'top');
    }

  }
}