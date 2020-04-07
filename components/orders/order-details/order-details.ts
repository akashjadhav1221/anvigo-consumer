import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'order-details',
  templateUrl: 'order-details.html'
})
export class OrderDetailsComponent {
  @Input() order: number;
  @Input() itemListVisible: boolean;
  @Output() onShowList = new EventEmitter();
  @Output() orderCancel = new EventEmitter();
  @Output() orderConfirm = new EventEmitter();

  showList: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    public commonProvider: CommonProvider,
    private callNumber: CallNumber
  ){

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('input changes', changes);
    if(changes.itemListVisible){
      this.showList = changes.itemListVisible.currentValue;
    }
  }

  showItemList(){
    this.showList = true;
    this.onShowList.emit(true);
  }

  cancelOrder(){
    this.orderCancel.emit(this.order);
  }

  confirmOrder(){
    this.orderConfirm.emit(this.order);
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      message: 'Do you really want to cancel this order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.cancelOrder();
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirmOrder(){
    let alert = this.alertCtrl.create({
      message: 'Confirm order?',
      buttons: [
        {
          text: 'Check Price List',
          handler: () => {
            this.showItemList();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Order confirmed')
            this.confirmOrder();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  makeCall(number){
    this.callNumber.callNumber(number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  sendMail(emailId){
    window.open("mailto:"+emailId, '_system');
  }
}