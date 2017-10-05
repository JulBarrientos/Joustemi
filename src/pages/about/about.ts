import { Component,NgZone } from '@angular/core';

import { NavController } from 'ionic-angular';

import {FileChooser} from '@ionic-native/file-chooser';

import {FirebaseApp } from 'angularfire2';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  constructor(public navCtrl: NavController,private firebaseApp: FirebaseApp,private fileChooser: FileChooser,public zone: NgZone) {

  }

 
  imgsource: any;
  nativepath: any;


  store() {
    this.fileChooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          this.uploadimage();
        })
      })
    }
  
    uploadimage() {
      (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {

            var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
            var imageStore = this.firebaseApp.storage().ref().child('image');
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
      this.firebaseApp.storage().ref().child('image').getDownloadURL().then((url) => {
        this.zone.run(() => {
          this.imgsource = url;
         })
      })
    }
  
}
