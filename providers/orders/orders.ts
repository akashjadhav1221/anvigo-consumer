import { Injectable } from '@angular/core';
import { CollectionConstants } from '../../common/constants/CollectionConstants';
import { FieldConstants } from '../../common/constants/FieldConstants';
import { UserProvider } from '../user/user';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastProvider } from '../toast/toast';
import { MessageConstants } from '../../common/constants/MessageConstants';
import { ObjectUnsubscribedError } from 'rxjs';

@Injectable()
export class OrdersProvider {
  public myOrders: any = [];
  public queryLimit: number = 2;
  public callCompleted: boolean = false;
  public error: boolean = false;
  public lastVisibleDoc: any;
  public paginationSpinner: boolean = false;
  public showLoadMoreBtn: boolean = false;
  public subscription: any;
  constructor(
    public userProvider: UserProvider,
    public afs: AngularFirestore,
    public toastProvider: ToastProvider
  ) {

  }

  getOrderById(id: string) {
    return this.myOrders.filter(order => {
      return order.id === id;
    })
  }

  getOrders() {
    if (!this.userProvider.user.uid) {
      console.log('no uid');
      this.error = true;
      return;
    } else {
      console.log('getOrders');
      this.subscription = this.getOrdersRef().onSnapshot(querySnapshot => {
        this.myOrders = [];
        if (querySnapshot.docs.length) {
          this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          querySnapshot.forEach(doc => {
            if (doc.exists) {
              let obj = doc.data();
              obj['id'] = doc.id;
              this.myOrders.push(obj);
            }
          });
          console.log('myOrders', this.myOrders);
        } else {
          console.log('no orders');
        }
        this.callCompleted = true;
        this.error = false;
      }, error => {
        this.callCompleted = true;
        this.error = true;
        console.log(error);
      });
    }
  }

  paginate() {
    this.showLoadMoreBtn = false;
    this.queryLimit = 10;
    this.paginationSpinner = true;
    this.subscription = this.getOrdersRef().startAfter(this.lastVisibleDoc).onSnapshot(querySnapshot => {

      if (querySnapshot.docs.length) {
        this.lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        if (querySnapshot.docs.length < 10) {
          this.showLoadMoreBtn = false;
        } else {
          this.showLoadMoreBtn = true;
        }
        querySnapshot.forEach(doc => {
          if (doc.exists) {
            let obj = doc.data();
            obj['id'] = doc.id;
            console.log('obj', obj);
            this.myOrders.push(obj);
          }
        });
      } else {
        this.showLoadMoreBtn = false;
      }
      this.paginationSpinner = false;
    }, error => {
      console.log(error);
      this.showLoadMoreBtn = false;
      this.toastProvider.presentToast(MessageConstants.SOMETHING_WENT_WRONG, 3000, 'top');
      this.paginationSpinner = false;
    });
  }

  getOrdersRef() {
    let ref = this.afs.collection(CollectionConstants.ORDERS).ref;
    return ref.where(FieldConstants.USER_ID, '==', this.userProvider.user.uid)
      .orderBy(FieldConstants.TIMESTAMP, 'desc').limit(this.queryLimit);
  }

  destroy() {
    this.subscription();
    this.myOrders = [];
    this.queryLimit = 2;
    this.callCompleted = false;
    this.error = false;
  }
}
