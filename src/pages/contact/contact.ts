import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController,public afAuth: AngularFireAuth) {

  }
  logout() {
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: 'forward'});
  }
}
