import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MixerTrack } from './mixer-track' 

//
// export model here
export { MixerTrack };

@Injectable()
export class AudioMixer {

  cbUpdate:Function;
  cbEnd:Function;

  mixer:Array<MixerTrack>=[];
  isPlaying:boolean;
  //context:AudioContext = new AudioContext();
  //
  // mixer tracks
  public tracks={
    'book':0,
    'atmosphere':1,
    'surprise':2
  }


  constructor(public http: Http) {
    //
    // create 3 tracks mixer
    this.mixer.push(new MixerTrack(
      'book',1.0,
      this.onUpdate.bind(this),
      this.onEnd.bind(this)
    ));
    this.mixer.push(new MixerTrack(
      'atmosphere',0.5,
      this.onUpdate.bind(this),
      this.onEnd.bind(this)
    ));
    this.mixer.push(new MixerTrack(
      'surprise',0.8,
      this.onUpdate.bind(this),
      this.onEnd.bind(this)
    ));

    this.isPlaying=false;
  }

  //
  // display current track information
  onUpdate(track:string,progress:number,completed:number){
    this.cbUpdate(track,progress,completed);
  }

  //
  // ask for next track
  onEnd(track:string){
    this.cbEnd(track);
  }
  
  bindEvents(onEnd:Function,onUpdate:Function){
    //TODO replace callback notification with an observable pattern
    this.cbEnd=onEnd;
    this.cbUpdate=onUpdate;
  }
  //
  // load new audio stream
  load(url:string,track:string){
    this.mixer[this.tracks[track]].setSrc(url);
  }

  //
  // volume for track
  volume(value:number,track:string){
    this.mixer[this.tracks[track]].setVolume(value);
  }

  pause(){
    this.isPlaying=false;
    this.mixer.forEach(mixer => mixer.pause())
  }
  play(url?:string,track?:string){
    this.isPlaying=true;
    if(url&&track){
      this.load(url,track);
    }
    if(track){
      return this.mixer[this.tracks[track]].play()
    }
    this.mixer.forEach(mixer => mixer.play())
  }

  toggle(){

  }



}
