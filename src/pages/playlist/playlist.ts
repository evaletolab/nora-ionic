import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { IonCategory } from '../../components/ion-categories';
import { 
  Asset,
  NoraService, 
  PlaylistInfo, 
  I_AssetSequencer, 
  StaticAssetSequencer, 
  DynamicAssetSequencer,
  id 
} from 'nora-ng';
import { Player } from '../../pages/player/player';




@Component({
  selector: 'playlist-page',
  templateUrl: 'playlist.html'
})

export class PlaylistPage {
  private categories: Array<IonCategory>=[];

  //
  // UI loader
  loader;

  constructor(
    public alertCtrl: AlertController,
    public loading : LoadingController,
    public navCtrl: NavController,
    public nora_service:NoraService
  ) {
  }

  ngOnInit(){
    this.loader = this.loading.create({
      content: "Chargement"
    });   

    this.loader.present();
    
    this.nora_service.init().then(()=>{
      let playlist_infos:ReadonlyArray<PlaylistInfo> = this.nora_service.available_playlists();
      playlist_infos.forEach(playlist=>{        
        this.categories.push({
          key:playlist.playlist_id,
          title:playlist.title,
          description:playlist.asset_count + ' éléments',
          background:'url('+playlist.image.url+') center center / cover no-repeat',
          onClick:this.selectList.bind(this)
        });
      });
      //
      // dismiss loader
      this.loader.dismiss();

    }).catch(error=>{
      error => this.displayError("Erreur",error)
    });
    
  }

  displayError(title, err){
    this.loader.dismiss();
    this.alertCtrl.create({
      title: title,
      subTitle: err.message,
      buttons: ['OK']
    }).present();
  }

  selectAuto(){
    this.navCtrl.push(Player, {
      background:'url(./assets/images/map.png) center center / cover no-repeat',
      auto:true
    });
    
  }

  selectList(listElement){
    this.navCtrl.push(Player, {
      key: listElement.key,
      background:listElement.background,
      title:listElement.title,
      auto:false
    });
  }
}
