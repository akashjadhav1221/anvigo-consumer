import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToastProvider } from '../../../providers/toast/toast';
import { CartProvider } from '../../../providers/cart/cart';
import { GroceryListProvider } from '../../../providers/grocery-list/grocery-list';

@Component({
  selector: 'create-grocery-list',
  templateUrl: 'create-grocery-list.html'
})
export class CreateGroceryListComponent {
  @Input() businessId: string;
  @Output() onGroceryListCreation = new EventEmitter();
  currentIndex: number = -1;
  matchedItems: any[] = [];
  constructor(
    public toastProvider: ToastProvider,
    public cartProvider: CartProvider,
    public listProvider: GroceryListProvider
  ) {
    console.log('constructor');
    if(this.cartProvider.groceryList.length){
      this.currentIndex = this.cartProvider.groceryList.length;
      this.matchedItems = this.listProvider.list;
    }else{
      this.matchedItems = this.listProvider.list;
      this.cartProvider.addItem();
      this.currentIndex++;
    }
  }

  increment(item: any, index: number) {
    item.quantity++;
    console.log(this.cartProvider.groceryList);
  }

  decrement(item: any, index: number) {
    console.log('index', index)
    if (item.quantity - 1 === 0) {
      this.cartProvider.groceryList.splice(index, 1);
      this.currentIndex--;
      console.log(this.cartProvider.groceryList);
    } else {
      item.quantity--;
    }

  }

  validate(){
    this.cartProvider.groceryList.forEach((item, index) => {
      if(item.name.trim() === ''){
        this.cartProvider.groceryList.splice(index, 1);
      }
    });
    console.log(this.cartProvider.groceryList);
    this.onGroceryListCreation.emit(true);
  }

  itemSelected(item){
    if(this.cartProvider.groceryList.length == 0){
      this.cartProvider.addItem();
      this.currentIndex = 0;
      this.cartProvider.groceryList[this.currentIndex]['name'] = item;
      this.currentIndex++;
    }else if(this.cartProvider.groceryList.length - this.currentIndex >= 2){
      this.cartProvider.groceryList[this.currentIndex]['name'] = item;
      this.currentIndex = this.cartProvider.groceryList.length - 1;
      this.cartProvider.addItem();
    }else if(this.cartProvider.groceryList.length == this.currentIndex){
      this.cartProvider.addItem();
      this.cartProvider.groceryList[this.currentIndex]['name'] = item;
      this.currentIndex++;
    }else{
      if(this.cartProvider.groceryList[this.currentIndex]){
      this.cartProvider.groceryList[this.currentIndex]['name'] = item;
      }else if(this.cartProvider.groceryList[this.currentIndex + 1]){
      this.cartProvider.groceryList[this.currentIndex + 1]['name'] = item;
      }
      this.currentIndex++;
      this.cartProvider.addItem();
    }
  }

  inputChange(event, index){
    this.currentIndex = index;
    console.log('index', index)
    if(event.length == 0){
      this.matchedItems = this.listProvider.list;
      return;
    }else{
    console.log(event);
    this.matchedItems = this.listProvider.list.filter(item => item.toLowerCase().startsWith(event.toLowerCase()));
    console.log(this.matchedItems)
    }
    
  }

}