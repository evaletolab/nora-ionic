import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


// Fix up prefixing
window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext'];




export class MixerTrack{
  private audio: HTMLAudioElement;

  // current time
  private _progress:number;

  // % completed
  private _completed:number;

  src:string;
  name:string;
  duration:number;
  isPlaying:boolean;
  volume:number;
  constructor(
    name:string, 
    volume:number,
    update:Function,
    end:Function
  ){
    this.name=name;

    // HTML audio is ready for streaming (vs AudioContext)
    this.audio = new Audio();
    this.volume=volume;
    this.name=name;



    //
    // map events
    this.audio.addEventListener("timeupdate", (e) => { 
      if (this.isPlaying && this.audio.currentTime > 0) {
        this._progress = this.audio.currentTime;
        this._completed = this.audio.duration > 0 ? Math.trunc (this.audio.currentTime / this.audio.duration * 100)/100 : 0;
      }            
      if(update)update(this.name,this._progress,this._completed); 
    }, false);
    
    this.audio.addEventListener("error", (err) => {
      console.log(`Audio error => track ${this.src}`, err);
      this.isPlaying = false;
    }, false);
    
    this.audio.addEventListener("canplay", () => {
      console.log(`Loaded track ${this.src}`);
      this.play();
      //if(ready)ready(this.TRACK);
    }, false);
    
    // this.audio.addEventListener("playing", () => {
    //   console.log(`Playing track ${this.src}`);
    //   //if(play)play(this.TRACK);
    // }, false);
    
    this.audio.addEventListener("ended", () => {
      console.log('Finished playback');
      if(end)end(this.name);
    }, false);
    
    this.audio.addEventListener("durationchange", (e:any) => {    
      this.duration = e.target.duration;
    }, false);  

  }
  setSrc(url){
    if(url===this.src){
      return;
    }
    // release previous buffer
    this.audio.pause();
    //this.audio.removeEventListener("timeupdate", (e) => { this.onTimeUpdate(e); });
    this.audio=undefined;
    this.audio = new Audio();    
    this.src=url;
    this.audio.src=url;
  }


  play(url?:string){
    console.log('---------',url,this.name, this.volume);    
    if(url){
      this.setSrc(url);
    }
    this.audio.volume=this.volume;
    this.audio.play();
    this.isPlaying=true;
  }

  pause(){
    if (!this.isPlaying) return;
    this.audio.pause();
    this.isPlaying = false;
  }

  //
  // volume values from 0 to 1.0 
  setVolume(volume){
    this.audio.volume=volume;
  }

}

@Injectable()
export class AudioMixer {

  mixer:Array<MixerTrack>=[];
  isPlaying:boolean;
  //context:AudioContext = new AudioContext();
  //
  // mixer tracks
  tracks={
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
      'atmosphere',0.4,
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
  }

  //
  // ask for next track
  onEnd(track:string){
  }
  
  //
  // load new audio stream
  load(url:string,track:string){
    console.log('---------',track,this.tracks[track])
    this.mixer[this.tracks[track]].setSrc(url);
  }

  pause(){
    this.isPlaying=true;
    this.mixer.forEach(mixer => mixer.pause())
  }
  play(url?:string,track?:string){
    this.isPlaying=false;
    if(url&&track){
      this.load(url,track);
    }
    this.mixer.forEach(mixer => mixer.play())
  }

  toggle(){

  }



}
