import { Injectable } from '@angular/core';
import { ToastProvider } from '../toast/toast';
import { MessageConstants } from '../../common/constants/MessageConstants';
import { Item } from '../../common/models/grocery-item';
import { UserProvider } from '../user/user';
import * as firebase from 'firebase';


@Injectable()
export class CartProvider {
  public groceryList: any;
  constructor(
    public toastProvider: ToastProvider,
    public userProvider: UserProvider
  ) {
    this.groceryList = [];
    //this.addItem();
  }

  public addItem() {
    if (this.groceryList.length > 200) {
      this.toastProvider.presentToast(MessageConstants.MAX_ITEM_LIMIT, 3000, 'top');
      return;
    } else {
      if (this.groceryList && this.groceryList.length > 0 && this.groceryList[this.groceryList.length - 1].name.trim() === '') {
        //this.toastProvider.presentToast(MessageConstants.ITEM_NAME_CANNOT_BE_EMPTY, 3000, 'top');
        return;
      } else {
        let item = {} as Item;
        item.name = '';
        item.price = null;
        item.quantity = 1;
        item.remark = null;
        item.status = '';
        this.groceryList.push(item);
        console.log(this.groceryList)
      }

    }
  }

  public confirmGroceryOrder(businessObject: any, deliveryMethod: string) {
    let orderObject = {};
    orderObject['isActive'] = true;
    orderObject['state'] = 'Approval Pending';
    orderObject['remark'] = '';

    orderObject['rating'] = null;
    orderObject['review'] = null;

    orderObject['user'] = {
      name : this.userProvider.user.displayName,
      id: this.userProvider.user.uid,
      email : this.userProvider.user.email,
      phoneNumber: this.userProvider.userDoc.phoneNumber,
      photoURL : this.userProvider.user.photoUrl ? this.userProvider.user.photoUrl : '',
      address: this.userProvider.userDoc.address,
      distance: businessObject.queryMetadata ? businessObject.queryMetadata.distance : null
    };

    orderObject['business'] = {
      id:  businessObject.id,
      name: businessObject.name,
      logo: businessObject.logo ? businessObject.logo : '',
      contactNumber: businessObject.contactNumber,
      email: businessObject.email
    };

    orderObject['keywords'] = [
      businessObject.id,
      businessObject.name.toLowerCase(),
      this.userProvider.user.email,
      this.userProvider.userDoc.phoneNumber
    ];

    orderObject['keywords'] = orderObject['keywords'].concat(this.userProvider.user.displayName.toLowerCase().split(' '));
      
    orderObject['timestamps'] = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      canceledAt: null,
      acceptedAt: null,
      confirmedAt: null,
      packingStartAt: null,
      packedAt: null,
      deliveredAt: null,
      pickedAt: null
    };
    orderObject['items'] = this.groceryList;

    orderObject['delivery'] = {
      method: deliveryMethod,
      time: '',
      charges: 0,
    };

    orderObject['amount'] = {
      total: null,
      paid: null,
      remaining: null
    }

    orderObject['payment'] = {
      method: 'Cash on Delivery',
      status: null
    }

    console.log('orderobject', orderObject);
    return orderObject;
  }


  destroy() {
    this.groceryList = [];
  }



}
