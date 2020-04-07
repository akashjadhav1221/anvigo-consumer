import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './credentials';

//PLUGINS
import { Network } from '@ionic-native/network';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { CallNumber } from '@ionic-native/call-number';
import { Firebase } from '@ionic-native/firebase';
import { SocialSharing } from '@ionic-native/social-sharing';

//PROVIDERS
import { ToastProvider } from '../providers/toast/toast';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { CommonProvider } from '../providers/common/common';
import { CartProvider } from '../providers/cart/cart';
import { OrdersProvider } from '../providers/orders/orders';
import { FcmProvider } from '../providers/fcm/fcm';
import { GroceryListProvider } from '../providers/grocery-list/grocery-list';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,  {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    CallNumber,
    Network,
    ScreenOrientation,
    Firebase,
    SplashScreen,
    OpenNativeSettings,
    LocationAccuracy,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ToastProvider,
    AuthProvider,
    UserProvider,
    CommonProvider,
    CartProvider,
    OrdersProvider,
    FcmProvider,
    GroceryListProvider,
    SocialSharing
  ]
})
export class AppModule {}
