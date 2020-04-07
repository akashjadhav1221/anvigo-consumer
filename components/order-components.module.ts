import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { OrderDetailsComponent } from './orders/order-details/order-details';
import { OrderListComponent } from './orders/order-list/order-list';

@NgModule({
	declarations: [
		OrderDetailsComponent,
		OrderListComponent
	],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [
		OrderDetailsComponent,
		OrderListComponent
	]
})
export class OrderComponentsModule {}
