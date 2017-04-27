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
      title: 'Dinner',
      description: '39 items',
      background: 'url(./assets/images/1.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Lunch',
      description: '53 items',
      background: 'url(./assets/images/2.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Desserts',
      description: '42 items',
      background: 'url(./assets/images/3.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Brunch',
      description: '44 items',
      background: 'url(./assets/images/4.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Beverages',
      description: '27 items',
      background: 'url(./assets/images/5.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }, {
      title: 'Catering',
      description: '29 items',
      background: 'url(./assets/images/6.jpg) center center / cover no-repeat',
      onClick: this.selectList.bind(this)
    }]
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
