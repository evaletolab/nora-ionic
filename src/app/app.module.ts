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
import { HomePage } from '../pages/home/home';
import { IonCategories } from '../components/ion-categories';
import { MyApp } from './app.component';
import { PlaylistPage } from '../pages/playlist/playlist';
import { Player } from '../pages/player/player';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Player,
    PlaylistPage,
    IonCategories
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      backButtonText:'',
      _backButtonIcon: 'concerto-dropleft',
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
    MyApp,
    HomePage,
    Player,
    PlaylistPage
  ],
  providers: [
    AudioMixer,
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
