import { Component  } from '@angular/core';
import { NavController, Loading, AlertController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {FirebaseApp } from 'angularfire2';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { EmailValidator } from '../../validators/email';
import { TabsPage } from '../tabs/tabs';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import {SignupPage} from '../signup/signup';
import {ResetPasswordPage} from '../reset-password/reset-password';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
  })

  export class LoginPage {
    public loginForm: FormGroup;
    public loading: Loading;
    isAuth: boolean =true;

      constructor(public afAuth: AngularFireAuth, private navCtrl: NavController, 
                  private firebaseApp: FirebaseApp,db: AngularFireDatabase,
                  public loadingCtrl: LoadingController, public formBuilder: FormBuilder,
                  public authProvider: AuthProvider,public alertCtrl: AlertController ) {
        this.loginForm = formBuilder.group({
          email: ['', 
          Validators.compose([Validators.required, EmailValidator.isValid])],
          password: ['', 
          Validators.compose([Validators.minLength(6), Validators.required])]
        });
        console.log("Constructor: ", new Date());
      }

      ionViewDidLoad() {
        // Put here the code you want to execute
      }

      loginFB() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        //this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        this.authProvider.loginFB();
      }

      loginGG() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.authProvider.loginGG();
      }
  loginUser(): void {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.authProvider.loginUser(
        this.loginForm.value.email, 
        this.loginForm.value.password
      ).then( authData => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(TabsPage);
        });
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });

    }
  }

  goToSignup(): void { 
    this.navCtrl.push(SignupPage); 
  }
  
  goToResetPassword(): void { 
    this.navCtrl.push(ResetPasswordPage); 
  }
  }

	



