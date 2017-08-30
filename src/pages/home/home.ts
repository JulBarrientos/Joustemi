import { Component,NgZone  } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';


import {File} from '@ionic-native/file';

import {FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, public media: Media,db: AngularFireDatabase,public firebaseApp: FirebaseApp,public zone: NgZone) { 
    document.addEventListener("deviceready", this.onDeviceReady, false);
    
    //this.items = db.list('/Items');
  }

  
  items: FirebaseListObservable<any[]>;
 


  onDeviceReady():void{
      console.log(Media);
  }
  record():void{
    const file = this.media.create('file.mp3');
    
    
    // Recording to a file

    
    file.startRecord();
    console.log("Grabando");
    window.setTimeout(() => {
                              file.stopRecord();
                              console.log("termino grabar");
                              this.uploadimage();
                            }, 3000);    
  }
  listen():void{ 
    const file: MediaObject = this.media.create('file.mp3');
    
    file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    
    file.onSuccess.subscribe(() => console.log('Action is successful'));
    
    file.onError.subscribe(error => console.log('Error!', error));
      // play the file
     file.play();
    
      // pause the file
      //file.pause();
    
      // get current playback position
     file.getCurrentPosition().then((position) => {
        console.log(position);
      });
    
      // get file duration
      let duration = file.getDuration();
      console.log(duration);
    
      // skip to 10 seconds (expects int value in ms)
      //file.seekTo(10000);
    
      // stop playing the file
      //file.stop();
    
      // release the native audio resource
      // Platform Quirks:
      // iOS simply create a new instance and the old one will be overwritten
      // Android you must call release() to destroy instances of media when you are done
      //file.release();
      //setTimeout(function() {
      //  this.file.stop();
      //  this.file.release();
      //}, 2000);
  }
  uploadimage() {
    console.log("upload imagen enter ");
    (<any>window).resolveLocalFileSystemURL('file.mp3', (res) => {
      console.log("file");
      res.file((resFile) => {
        console.log("read");
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          console.log("uploading")

          var imgBlob = new Blob([evt.target.result], { type: 'audi/mp3' });
          var imageStore = this.firebaseApp.storage().ref().child('audio');
          imageStore.put(imgBlob).then((res) => {
            alert('Upload Success');
          }).catch((err) => {
            alert('Upload Failed' + err);
          })
        }
      })
    })

  }
}
