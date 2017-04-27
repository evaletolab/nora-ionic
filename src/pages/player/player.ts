import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  background:string;
  title:string;
  auto:boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
     this.title = navParams.get('title');
     this.background = navParams.get('background');
     this.auto=navParams.get('auto');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Player');
  }

}
