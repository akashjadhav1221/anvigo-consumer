import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersPage } from './orders';
import { OrderComponentsModule } from '../../components/order-components.module';

@NgModule({
  declarations: [
    OrdersPage
  ],
  imports: [
    IonicPageModule.forChild(OrdersPage),
    OrderComponentsModule
  ],
})
export class OrdersPageModule {}
