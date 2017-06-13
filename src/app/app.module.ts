import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//
// custom elements
import { AudioMixer } from '../providers/audio-mixer';
import { LocationTracker } from '../providers/background-geo';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { HomePage } from '../pages/home/home';
import { IonCategories } from '../components/ion-categories';
import { NoraApp } from './app.component';
import { PlaylistPage } from '../pages/playlist/playlist';
import { Player } from '../pages/player/player';

import { NoraService } from 'nora-ng';


@NgModule({
  declarations: [
    NoraApp,
    HomePage,
    Player,
    PlaylistPage,
    IonCategories
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(NoraApp,{
      backButtonText:'',
      _backButtonIcon: 'dropleft',
      platforms : {
        //Fix issue on IOS with keyboard and scrolling content
        ios : {
          scrollAssist: false,
          autoFocusAssist: false
        }
      }
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NoraApp,
    HomePage,
    Player,
    PlaylistPage
  ],
  providers: [
    AudioMixer,
    BackgroundGeolocation,
    LocationTracker,
    NoraService,
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
