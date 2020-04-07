import { Injectable } from '@angular/core';
import { User } from '../../common/models/user';
import { UserDoc } from '../../common/models/userDoc';

@Injectable()
export class UserProvider {
  public user = {} as User;
  public userDoc = {} as UserDoc;
  constructor() {
  }

  setUser(userInstance: any){
    this.user.email = userInstance.email;
    this.user.displayName = userInstance.displayName;
    this.user.emailVerified = userInstance.emailVerified;
    this.user.phoneNumber = userInstance.phoneNumber;
    this.user.photoUrl = userInstance.photoUrl;
    this.user.uid = userInstance.uid;
  }

  getUser(){
    return this.user;
  }

  setUserDoc(userDocInstance: any){
   this.userDoc.address = userDocInstance.address;
   this.userDoc.email = userDocInstance.email;
   this.userDoc.language = userDocInstance.language;
   this.userDoc.location = userDocInstance.location;
   this.userDoc.phoneNumber = userDocInstance.phoneNumber;
   this.userDoc.role = userDocInstance.role;
   this.userDoc.timestamp = userDocInstance.timestamp;
   console.log('userDoc set');
  }

  getUserDoc(){
    delete this.userDoc['__proto__'];
    return this.userDoc;
  }

  destroy(){
    this.user = {} as User;
    this.userDoc = {} as UserDoc;
  }

}
