import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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
  locationMarkers=[];

  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  

  constructor(
    public mixer: AudioMixer,
    public geolocation: Geolocation,
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
    if(this.play&&this.auto)this.runGeoloc();
    if(this.play){
      this.mixer.play(this.URL_BOOK,'book');
      this.mixer.play(this.URL_ZONE,'atmosphere');
    }else {
      this.mixer.pause()
    };
  }

  doControls(){
    this.controls=!this.controls;
  }

  //
  // MAP
  loadMap(){ 
    if(!this.auto){
      // no map in this case
      return;
    }
 
    this.geolocation.getCurrentPosition().then((position) => {
      console.log('---------------- GEO',position.coords.latitude, position.coords.longitude)
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggable:false
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
    }, (err) => {
      console.log(err);
    });
 

  }

  runGeoloc(){
    setTimeout(()=>{
      this.geolocation.getCurrentPosition().then((position) => {
        //
        // add marker on map
        this.locationMarkers.push(new google.maps.Marker({
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: 'green',
                fillOpacity: .7,
                strokeColor: 'white',
                strokeWeight: 3
            },
            map: this.map,
            position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        }));

        //
        // sure to get next position after this one!
        if(this.play){
          this.runGeoloc();
        }
      });
    },5000);
    
    // let marker = new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: this.map.getCenter()
    // });
    //let content = "<h4>Information!</h4>";          
    //this.addInfoWindow(marker, content);
  }

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
    console.log('ionViewDidLoad Player');
    this.loadMap();
  }

  ionViewWillUnload(){
    this.play=false;
    this.auto=false;
    console.log('ionViewWillUnload Player');    
  }
  
}