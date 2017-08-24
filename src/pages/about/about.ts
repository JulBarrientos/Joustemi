import { Component,NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';

import {File} from '@ionic-native/file';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path'

import {FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  constructor(public navCtrl: NavController,private firebaseApp: FirebaseApp,private fileChooser: FileChooser,public zone: NgZone) {

  }

  firestore = this.firebaseApp.storage();
  imgsource: any;
  nativepath: any;


  store() {
    this.fileChooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          this.uploadimage();
        }
        )
      })
    }
  
    uploadimage() {
      (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
            var imageStore = this.firestore.ref().child('image');
            imageStore.put(imgBlob).then((res) => {
              alert('Upload Success');
            }).catch((err) => {
              alert('Upload Failed' + err);
            })
          }
        })
      })
    }
  
    display() {
      this.firestore.ref().child('image').getDownloadURL().then((url) => {
        this.zone.run(() => {
          this.imgsource = url;
         })
      })
    }
  
}
