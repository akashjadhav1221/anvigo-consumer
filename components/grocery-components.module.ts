import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { StoreListComponent } from './grocery/store-list/store-list';
import { CreateGroceryListComponent } from './grocery/create-grocery-list/create-grocery-list';
import { DeliverTypeComponent } from './grocery/deliver-type/deliver-type';

@NgModule({
	declarations: [
	StoreListComponent,
	CreateGroceryListComponent,
	DeliverTypeComponent
	],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [
	StoreListComponent,
	CreateGroceryListComponent,
	DeliverTypeComponent
	]
})
export class GroceryComponentsModule {}
