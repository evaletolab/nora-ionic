import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocationTracker } from '../../providers/background-geo';
import { AudioMixer } from '../../providers/audio-mixer';

import { Asset, I_AssetSequencer, NoraService } from 'nora-ng';
declare var google;

/**
 * Generated class for the Player page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class Player {

  // URL_BOOK="https://dl.airtable.com/t55hy3XSeGZHUOOS1aQK_la-traduction-du-successif.m4a";
  // URL_ZONE="https://dl.airtable.com/WKcMpGdTRZOW5z6dNgEW_au-hasard-du-chemin.m4a ";
  

  background:string;
  thumbnail:string;
  title:string;
  auto:boolean;
  defaultBackground='url(./assets/images/1.ile-saint-louis.jpg) center center / cover no-repeat';
  play:boolean=false;
  controls:boolean=false;
  progress:number;
  completed:number;

  // 
  // Nora core
  key:string;
  sequencer:I_AssetSequencer;
  assetBook:Asset;
  assetAtmosphere:Asset;
  //
  // history of position
  markers=[];

  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  

  constructor(
    public alertCtrl: AlertController,
    public mixer: AudioMixer,
    public events: Events,
    public locationTracker: LocationTracker,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public nora_service:NoraService
  ) {
    this.key=navParams.get('key');
    this.auto=navParams.get('auto');
    this.background=(this.auto)?this.defaultBackground:navParams.get('background');
    this.thumbnail=navParams.get('background');
    this.title = navParams.get('title')||'Au hasard du chemin';
    this.progress=0;
    this.completed=0;

    //
    // build static or gps sequencer
    if(navParams.get('key')){
      this.sequencer = this.nora_service.static_asset_sequencer_with_playlist_id(navParams.get('key'));
    }else{
      this.sequencer = this.nora_service.dynamic_asset_sequencer();
    }


    this.mixer.bindEvents(this.onMixerEnd.bind(this),this.onMixerUpdate.bind(this));

    
    //
    // initial asset for this player
    this.assetBook=this.sequencer.next();
    this.thumbnail='url('+this.assetBook.images[0].thumbnails.large.url+') center center / cover no-repeat';

    // this.assetAtmosphere=this.sequencer.next();

  }


  displayError(title, err){
    this.alertCtrl.create({
      title: title,
      subTitle: err.message,
      buttons: ['OK']
    }).present();
  }

  doToggle(){
    //
    // toggle play
    this.play=!this.play;


    //
    // start location tracker?
    if(this.play&&this.auto)this.locationTracker.start();

    //
    // toggle player 
    if(this.play){
      if(this.assetBook.audio_file.length)
        this.mixer.play(this.assetBook.audio_file[0].url,'book');
      // this.mixer.play(this.assetAtmosphere.audio_file.url,'atmosphere');
    }else {
      this.mixer.pause();
    };


  }

  doControls(){
    this.controls=!this.controls;
  }

  //
  // MAP
  initGeoTracker(){ 
    if(!this.auto){
      // no map in this case
      return;
    }
 
    // init map
    // Île Saint-Louis, Paris, France
    // 48.8516073,2.3544833
    //         mapTypeId: google.maps.MapTypeId.TERRAIN,
    let latLng = new google.maps.LatLng(48.8516073,2.3544833);
    // this.bounds= new google.maps.LatLngBounds();


    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable:false,
      disableDoubleClickZoom:true
    }

    let map= this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.events.subscribe('location',(location)=>{
      console.log('------------GEO '+JSON.stringify(location));

      if(location.error){
        return this.displayError("Problème GPS 8-(",location.error);
      }
      //
      // add marker on map
      this.markers.push(new google.maps.Marker({
          icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: 'green',
              fillOpacity: .7,
              strokeColor: 'white',
              strokeWeight: 3
          },
          map: this.map,
          position: new google.maps.LatLng(location.latitude, location.longitude)
      }));

      //
      // fit the map to the newly inclusive bounds
      let latLng = this.markers[this.markers.length-1].getPosition(); // returns LatLng object
      map.setCenter(latLng); // setCenter takes a LatLng object      

    });

    //
    // run tracker
    this.locationTracker.start();

  }

  // let marker = new google.maps.Marker({
  //   map: this.map,
  //   animation: google.maps.Animation.DROP,
  //   position: this.map.getCenter()
  // });
  //let content = "<h4>Information!</h4>";          
  //this.addInfoWindow(marker, content);

  //
  // useless for now
  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }  
  


  //
  // EVENTS

  onMixerEnd(track:string){

    this.progress=0;
    this.assetBook=this.sequencer.next();
    if(this.assetBook&&this.assetBook.audio_file){
      this.mixer.play(this.assetBook.audio_file[0].url,'book');
      this.thumbnail='url('+this.assetBook.images[0].thumbnails.large.url+') center center / cover no-repeat'
    }

    // console.log('----------------- end',track);
  }
  onMixerUpdate(track:string,progress:number,completed:number){
    if(track==='book'){
      this.progress=(progress|0);
      this.completed=completed;
    }
    // console.log('----------------- update',track,progress);

  }

  ionViewDidLoad() {
    this.initGeoTracker();
  }

  //
  // clean resources on exit;
  ionViewWillUnload(){
    this.locationTracker.stop();
    this.mixer.pause()
    this.play=false;
    this.auto=false;
  }
  
}