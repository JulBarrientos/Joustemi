import {Injectable} from '@angular/core';
import {UserData} from '../../class/user';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {
  constructor() {}

  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  loginFB() : firebase.Promise<any>{
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithRedirect(provider);
  }

  loginGG(): firebase.Promise<any>{
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithRedirect(provider);
  }
  signupUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( newUser => {
                var userDate = new UserData(email);
                firebase.database().ref('/userProfile').child(newUser.uid).set(userDate);
            });
  }

  resetPassword(email: string): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<void> {
    return firebase.auth().signOut();
  }
  
}