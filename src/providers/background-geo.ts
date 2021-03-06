import { Injectable, NgZone } from '@angular/core';
import { Events } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class LocationTracker {

  //
  // https://github.com/mauron85/cordova-plugin-background-geolocation 
  config = {
    stationaryRadius: 10,
    distanceFilter: 15,
    desiredAccuracy: 10,
    interval: 5000,
    // fastestInterval:2000,
    // stopOnTerminate:false,
    locationProvider:0
    // debug: true,
    // locationProvider: this.backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
    // fastestInterval: 5,
    // activitiesInterval: 10,
    // stopOnTerminate: false,
    // startOnBoot: false,
    // startForeground: true,
    // stopOnStillActivity: true,
    // activityType: 'Fitness',
    // saveBatteryOnBackground: false
  };

  options = {
    enableHighAccuracy: true,
    timeout: 60000,
    frequency:6000,
    maximumAge: 0
  };

  location:{
    lat: number;
    lng: number;  
  }

  constructor(
    public backgroundGeolocation:BackgroundGeolocation,
    public events: Events,
    public geolocation:Geolocation,
    public http: Http,
    public zone: NgZone
  ) {
  }

  start(){
    //
    // first sample in foreground
    this.geolocation.getCurrentPosition(this.options).then((position:Geoposition)=>{      
      this.zone.run(() => this.events.publish('location',position.coords));      
    })

    this.backgroundGeolocation.configure(this.config).subscribe((location:BackgroundGeolocationResponse) => {
    // Run update inside of Angular's zone
    
      this.zone.run(() => this.events.publish('location',location));
    }, (err) => {
      //
      // inform errors
      this.zone.run(() => this.events.publish('location',{error:err}))  ;
    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    //
    // Foreground Tracking
    // this.watch = this.geolocation.watchPosition(this.options)
    //   .filter((p: any) => p.code === undefined)
    //   .subscribe((position: Geoposition) => {
    //   // Run update inside of Angular's zone
    //   this.zone.run(() => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //   });
    // });


  }

  stop(){
    console.log('-------------------- GEO.STOP')
    this.backgroundGeolocation.finish();
    //this.watch.unsubscribe();
  }

}
