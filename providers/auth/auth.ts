import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {

  constructor(
    private afAuth: AngularFireAuth
  ) {
  }

  loginUserWithEmail(email: string, password: string){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string){
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signUpUserWithEmail(email: string, password: string){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  setUserProfile(displayName: string, photoURL: string){
    let user = this.afAuth.auth.currentUser;
    if(user != null){
    return user.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    });
    }else{
    return null;
    }
  }

  sendEmailVerificationLink(){
    let user = this.afAuth.auth.currentUser;
    if(user != null){
      return user.sendEmailVerification();
    }else{
      return null;
    }
  }

  signOut(){
    return this.afAuth.auth.signOut();
  }

  

}
