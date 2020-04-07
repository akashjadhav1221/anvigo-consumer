import { Injectable } from '@angular/core';

@Injectable()
export class CommonProvider {

  public isOnline: boolean = true;

  constructor() {
    console.log('Hello CommonProvider Provider');
  }

  public getLoadingTextAlternative():string{
    let alternatives = [
      'Contacting space-time continuum...',
      'Connecting to satellite...'
    ];
    let random = Math.floor(Math.random() * alternatives.length);
    return alternatives[random];
  }

  public getUploadTextAlternative():string{
    let alternatives = [
      'Sending signals...',
      'Creating uplink...'
    ];
    let random = Math.floor(Math.random() * alternatives.length);
    return alternatives[random];
  }

  public getOrderState(state: string): string{
    if(state === 'Approval Pending'){
      return 'Confirming order with store';
    }else if(state === 'Accepted by store owner'){
      return 'Check price & confirm order'
    }else if(state === 'Canceled by store owner'){
      return 'Order canceled by store'
    }else if(state === 'Packed'){
      return 'Order is packed'
    }else if(state === 'Delivered'){
      return 'Delivered'
    }else if(state === 'Canceled by user'){
      return 'You have canceled this order'
    }else{
      return state
    }
  }

}
