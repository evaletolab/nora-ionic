import { Component, ElementRef, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocationTracker } from '../../providers/background-geo';
import { AudioMixer } from '../../providers/audio-mixer';

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

  URL_BOOK="https://dl.airtable.com/t55hy3XSeGZHUOOS1aQK_la-traduction-du-successif.m4a";
  URL_ZONE="https://dl.airtable.com/WKcMpGdTRZOW5z6dNgEW_au-hasard-du-chemin.m4a ";
  

  background:string;
  thumbnail:string;
  title:string;
  auto:boolean;
  defaultBackground='url(./assets/images/1.ile-saint-louis.jpg) center center / cover no-repeat';
  play:boolean=false;
  controls:boolean=false;

  //
  // history of position
  markers=[];

  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  

  constructor(
    public mixer: AudioMixer,
    public events: Events,
    public locationTracker: LocationTracker,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.auto=navParams.get('auto');
    this.background=(this.auto)?this.defaultBackground:navParams.get('background');
    this.thumbnail=navParams.get('background');
    this.title = navParams.get('title')||'Au hasard du chemin';


  }


  doToggle(){
    this.play=!this.play;
    if(this.play&&this.auto)this.locationTracker.start();
    if(this.play){
      this.mixer.play(this.URL_BOOK,'book');
      this.mixer.play(this.URL_ZONE,'atmosphere');
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

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable:false,
      disableDoubleClickZoom:true
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.events.subscribe('location',(location)=>{
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
          position: new google.maps.LatLng(location.lat, location.lng)
      }));
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