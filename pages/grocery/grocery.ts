import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { CartProvider } from '../../providers/cart/cart';

@IonicPage()
@Component({
  selector: 'page-grocery',
  templateUrl: 'grocery.html',
})
export class GroceryPage {
  @ViewChild(Navbar) navBar: Navbar;
  title: string = 'Select Store';
  loadingMsg: string = '';
  showSpinner: boolean = false;
  selectedStore: any;
  component: string = 'store-list';
  orderPosted: boolean = false;
  //locationClicked: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonProvider: CommonProvider,
    public cartProvider: CartProvider,
    public alertCtrl: AlertController
    ) {
      this.loadingMsg = this.commonProvider.getLoadingTextAlternative();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      if(this.component === 'store-list'){
        this.navCtrl.pop();
      }else if(this.component === 'create-grocery-list'){
        this.component = 'store-list';
        this.title = 'Select Store'
      }else if(this.component === 'deliver-type' && !this.orderPosted){
        this.component = 'create-grocery-list';
        this.title = 'Create Grocery List';
      }else if(this.component === 'deliver-type' && this.orderPosted){
        this.navCtrl.pop();
      }
     }
  }

  goBack(){
    this.navCtrl.pop();
  }

  onStoreSelection(store){
    console.log('selecte store',store);
    this.selectedStore = store;
    this.component = 'create-grocery-list';
    this.title = 'Create Grocery List';
  }

  onGroceryListCreation(event){
    console.log('grocery list created', event);
    this.component = 'deliver-type';
    this.title = 'Select Delivery Method'
  }

  showEditList(event){
    console.log(event);
    this.component = 'create-grocery-list';
    this.title = 'Create Grocery List';
  }

  onOrderPost(event){
    this.title = 'Order Placed';
    this.orderPosted = event;
  } 

  // locationCliked(){
  //   this.locationClicked = true;
  // }

}
