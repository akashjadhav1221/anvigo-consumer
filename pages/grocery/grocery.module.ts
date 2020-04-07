import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroceryPage } from './grocery';
import { GroceryComponentsModule } from '../../components/grocery-components.module';

@NgModule({
  declarations: [
    GroceryPage,
  ],
  imports: [
    IonicPageModule.forChild(GroceryPage),
    GroceryComponentsModule
  ],
})
export class GroceryPageModule {}
