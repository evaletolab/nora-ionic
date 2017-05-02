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
  thumbnail:string;
  title:string;
  auto:boolean;
  defaultBackground='url(./assets/images/1.ile-saint-louis.jpg) center center / cover no-repeat';
  play:boolean=false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.auto=navParams.get('auto');
    this.background=(this.auto)?this.defaultBackground:navParams.get('background');
    this.thumbnail=navParams.get('background');
    this.title = navParams.get('title')||'Au hasard du chemin';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Player');
  }

  doToggle(){
    this.play=!this.play;
  }
}
