import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonCategory } from '../../components/ion-categories';
import { Player } from '../../pages/player/player';

@Component({
  selector: 'playlist-page',
  templateUrl: 'playlist.html'
})

export class PlaylistPage {
  private categories: Array<IonCategory>;

  constructor(
    public navCtrl: NavController
  ) {
    this.categories = [{
      title: 'Ile Saint Louis',
      description: '39 éléments',
      background: 'url(./assets/images/1.ile-saint-louis.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Orleans',
      description: '53 éléments',
      background: 'url(./assets/images/2.orleans.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Anjou',
      description: '42 éléments',
      background: 'url(./assets/images/3.anjou.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Bourbon',
      description: '44 éléments',
      background: 'url(./assets/images/4.bourbon.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Béthune',
      description: '27 éléments',
      background: 'url(./assets/images/5.bethune.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Anjou',
      description: '29 éléments',
      background: 'url(./assets/images/3.anjou.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }]
  }

  selectAuto(){
    this.navCtrl.push(Player, {
      background:'url(./assets/images/map.png) center center / cover no-repeat',
      auto:true
    });
    
  }

  selectList(list){
    this.navCtrl.push(Player, {
      list: list,
      background:list.background,
      title:list.title,
      auto:false
    });
  }
}
