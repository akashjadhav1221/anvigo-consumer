import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonProvider } from '../../../providers/common/common';
import { OrdersProvider } from '../../../providers/orders/orders';

@Component({
  selector: 'order-list',
  templateUrl: 'order-list.html'
})
export class OrderListComponent {
  showSpinner: boolean = false;
  loadingMsg: string = '';
  @Output() onOrderSelected = new EventEmitter();

  constructor(
    public commonProvider: CommonProvider,
    public ordersProvider: OrdersProvider) {
      this.loadingMsg = this.commonProvider.getLoadingTextAlternative();
  }

  orderSelected(order){
    this.onOrderSelected.emit(order);
  }

  
}