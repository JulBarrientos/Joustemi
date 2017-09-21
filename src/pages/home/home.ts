import { Component,NgZone  } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { DatePipe } from '@angular/common'

import {File} from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { AndroidPermissions } from '@ionic-native/android-permissions';

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

  constructor(private navCtrl: NavController, private datepipe: DatePipe, private media: Media, 
               private file: File, db: AngularFireDatabase, private firebaseApp: FirebaseApp,
                private zone: NgZone, private platform: Platform, private transfer: FileTransfer,
                  private androidPermissions: AndroidPermissions) { 
    const fileTransfer: FileTransferObject = this.transfer.create();
    document.addEventListener("deviceready", this.onDeviceReady, false);
    db.list('/Audios', { preserveSnapshot: true})
    .subscribe(snapshots=>{
      snapshots.forEach(snapshot => {
         this.firebaseApp.storage().ref().child("Audios/"+snapshot.val().name).getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'
        console.log("donwload file: "+snapshot.val().name);
        console.log("URL\n"+url);
        // This can be downloaded directly:
        console.log(fileTransfer);
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

    this.items = db.list('/Audios');
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS])
  }

  
  
  onDeviceReady():void{
      console.log(Media);
  }


  record():void{
    this.recording = !this.recording;
    const format = 'h:mm:ss';
    const date =  new Date(); 
    var fileName = "audio"+this.datepipe.transform(date, 'yyyy-MM-dd hh:mm:ss')+".mp3";
    fileName = fileName.replace(/:/gi,".");
    console.log(fileName);
    const file: MediaObject = this.media.create(fileName);

    file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    file.onSuccess.subscribe(() => {console.log('Action is successful');  this.recording = !this.recording;});
    file.onError.subscribe(error => {console.log('Error!', error);  this.recording = !this.recording;;});
  
    // Recording to a file
    file.startRecord();
    
    console.log("Grabando");
    window.setTimeout(() => {
                              file.stopRecord();
                              console.log("termino grabar");
                              this.uploadimage(fileName, file);

                            }, 4500 );    
  }


  stop():void{
    this.currentPlaying.stop()
  }

  
  play(fileName:string):void{ 
    console.log(fileName);
    const file: MediaObject = this.media.create(fileName.toString());
    
    file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes
    
    file.onSuccess.subscribe(() => {console.log('Action is successful');this.playing = !this.playing;});
    
    file.onError.subscribe(error => {console.log('Error!', error);this.playing = !this.playing;});
      // play the file
     file.play();
     this.playing = !this.playing;
     this.currentPlaying =file;
      // pause the file
      //file.pause();
      file.getCurrentPosition().then((position) => {
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

  
  uploadimage(fileName:string, file:MediaObject ) {
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
                  this.items.push({name:fileName,usu:this.usu});
                  file.release();
                }).catch((err) => {
                  alert('Upload Failed' + err);
                })
            }
        })
    })

  }
}
