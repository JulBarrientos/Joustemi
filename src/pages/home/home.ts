import { Component,NgZone  } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
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

  file: MediaObject = this.media.create('path/to/file.mp3');
  items: FirebaseListObservable<any[]>;
 

 
  onDeviceReady():void{
      console.log(Media);
  }
  record():void{
    // Recording to a file
    
    this.file.startRecord();
    window.setTimeout(() => this.file.stopRecord(), 10000);    
  }
  listen():void{ 
      
    // Create a Media instance.  Expects path to file or url as argument
    // We can optionally pass a second argument to track the status of the med
      // to listen to plugin events:
      this.file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    
      this.file.onSuccess.subscribe(() => console.log('Action is successful'));
    
      this.file.onError.subscribe(error => console.log('Error!', error));
    
      // play the file
      this.file.play();
    
      // pause the file
      //file.pause();
    
      // get current playback position
      this.file.getCurrentPosition().then((position) => {
        console.log(position);
      });
    
      // get file duration
      let duration = this.file.getDuration();
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
      setTimeout(function() {
        this.file.stop();
        this.file.release();
      }, 2001);
  }
  
}
