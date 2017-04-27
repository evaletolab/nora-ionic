import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonCategories } from '../components/ion-categories';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
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
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Player,
    PlaylistPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
