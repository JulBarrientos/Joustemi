import { Component,NgZone  } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import {FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
  })

  export class LoginPage {
    usu: string ='';
    pass: string ='';
    user: Observable<firebase.User>;
    
      constructor(public afAuth: AngularFireAuth,private firebaseApp: FirebaseApp, private navCtrl: NavController) {
        this.user = afAuth.authState;
      }
      ionViewDidLoad() {
        if(this.user!=null){
          this.navCtrl.setRoot(TabsPage, {}, {animate: true, direction: 'forward'});
        }
       
      }
      login() {
        //this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider).then(function() {
            firebase.auth().getRedirectResult().then(function(result) {
              // This gives you a Google Access Token.
              // You can use it to access the Google API.
              console.log("Login done");
            //  this.navCtrl.setRoot(TabsPage, {}, {animate: true, direction: 'forward'});

              //var token = result.credential.accessToken;
              // The signed-in user info.
              //var user = result.user;
              
              // ...
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.name;
              var errorMessage = error.message;
              console.log("Error code: "+errorCode);
              console.log("Error message: "+errorMessage);
              alert("Error Login")
            });
          });
      }
    
      logout() {
        this.afAuth.auth.signOut();
      }
    regist(){
        this.firebaseApp.auth().createUserWithEmailAndPassword(this.usu, this.pass).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.name;
            var errorMessage = error.message;
            console.log("Error code: "+errorCode);
            console.log("Error message: "+errorMessage);
            // ...
          });
    }
    login2(){
        this.firebaseApp.auth().signInWithEmailAndPassword(this.usu,this.pass).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.name;
            var errorMessage = error.message;
            console.log("Error code: "+errorCode);
            console.log("Error message: "+errorMessage);
            // ...
          });
    }
  }