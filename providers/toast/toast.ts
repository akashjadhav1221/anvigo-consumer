import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';


@Injectable()
export class ToastProvider {

  constructor(
    public toastCtrl: ToastController
  ) {
  }

  presentToast(message: string, duration: number, position: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });
  
    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    // });
  
    toast.present();
  }

  presentToastWithCloseBtn(message: string, position: string, closeBtnText: string){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: closeBtnText,
      position: position
    });
  
    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    // });
  
    toast.present();
  }

}
