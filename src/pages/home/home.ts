import { Component  } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';
import { DatePipe } from '@angular/common'


import "rxjs/add/operator/map";

import { AlertController } from 'ionic-angular';


import {File} from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { AndroidPermissions } from '@ionic-native/android-permissions';

import * as firebase from 'firebase/app';
import {FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

  

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  items: FirebaseListObservable<any[]>;
  recording: boolean=false;
  playing: boolean=false;
  currentPlaying: any;
  usu: string ='';
  alert;
  audioRecord: MediaObject;
  timeOut;

  constructor(private datepipe: DatePipe, private media: Media, private transfer: FileTransfer,
              private file: File, db: AngularFireDatabase, private firebaseApp: FirebaseApp,
              private androidPermissions: AndroidPermissions,
              private alertCtrl: AlertController) {
    document.addEventListener("deviceready", this.onDeviceReady, false);          
    androidPermissions.requestPermissions([androidPermissions.PERMISSION.RECORD_AUDIO,androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]); 
    //this.showAlert()
    const fileTransfer: FileTransferObject = this.transfer.create();

    db.list('/Audios', { preserveSnapshot: true})
      .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          this.firebaseApp.storage().ref().child("Audios/"+snapshot.val().name).getDownloadURL().then(function(url) {
          // `url` is the download URL for 'images/stars.jpg
          // This can be downloaded directly:
      
          fileTransfer.download(url,file.externalRootDirectory+"PruebaRecord/" + snapshot.val().name)
          .then((entry) => {
            console.log('download complete: ' + entry.toURL());
          }, (error) => {
            console.log(error);
          });

          }).catch(function(error) {
            console.log(error);
          });
      });
    });
    this.items = db.list('/Audios', {
      query: {
        orderByChild: 'timeRecorded'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
      
  }


  
  onDeviceReady():void{
  
  }


  record():void{
    this.recording = !this.recording;

    var now = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss').toString();

    var fileName = "audio" + now + ".mp3";
    fileName = fileName.replace(/:/gi,".");
    console.log(fileName);

    this.audioRecord = this.media.create(fileName);
    this.audioRecord.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    this.audioRecord.onSuccess.subscribe(() => {console.log('Action is successful');  this.recording = !this.recording;});
    this.audioRecord.onError.subscribe(error => {console.log('Error!', error);  this.recording = !this.recording;;});
  
    // Recording to a file
    this.audioRecord.startRecord();
    this.showAlert();
    console.log("Grabando");
    this.timeOut = window.setTimeout(() => {
        this.audioRecord.stopRecord();
        console.log("termino grabar");
        this.uploadAudio(fileName, this.audioRecord, now);
        this.alert.dismiss();
    }, 4500 );    
  }


  stop():void{
    this.currentPlaying.stop()
  }

  
  play(fileName:string):void{ 
    console.log(fileName);
    this.audioRecord = this.media.create(this.file.externalRootDirectory + "PruebaRecord/" +fileName.toString());
    
    this.audioRecord.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    
    this.audioRecord.onSuccess.subscribe(() => {console.log('Action is successful');this.playing = !this.playing;});
    
    this.audioRecord.onError.subscribe(error => {console.log('Error!', error);this.playing = !this.playing;});
      // play the file
      this.audioRecord.play();
     this.playing = !this.playing;
     this.currentPlaying = this.audioRecord;
      // pause the file
      //file.pause();
      this.audioRecord.getCurrentPosition().then((position) => {
        console.log(position);
      });
    
      // get file duration
      //let duration = file.getDuration();
      //console.log(duration);
    
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
  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Recording',
      message: "<div class='bars'>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "<div class='bar'></div>"
              + "</div>",
      buttons:[
          {
            text: 'Abort',
            role: 'destructive',
            handler: () => {
              console.log('Destructive clicked');
            }
          },
          {
            text: 'Stop',
            role: 'destructive',
            handler: () => {
              console.log('Destructive clicked');
            }
          }
      ]
    });
    this.alert.present();
  }
  
  uploadAudio(fileName:string, audio:MediaObject, now:string) {
    console.log("upload imagen enter "+fileName);
    console.log(this.file.externalRootDirectory);
    (<any>window).resolveLocalFileSystemURL(this.file.externalRootDirectory  + fileName, (res) => {
        console.log("file");
        res.file((resFile) => {
            console.log("read");
            var reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
                console.log("uploading");
                var imgBlob = new Blob([evt.target.result], { type: 'audio/mp3' });
                var imageStore = this.firebaseApp.storage().ref().child("Audios/"+fileName);
                imageStore.put(imgBlob).then((res) => {
                  alert('Upload Success');
                  this.items.push({name:fileName,usu:firebase.auth().currentUser.email,timeRecorded:now});
                  
                  audio.release();
                }).catch((err) => {
                  alert('Upload Failed' + err);
                })
            }
        })
    })

  }
}
