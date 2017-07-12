import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


// Fix up prefixing
window['AudioContext'] = window['AudioContext'] || window['webkitAudioContext'];




export class MixerTrack{
  private audio: HTMLAudioElement;
  private audioCtx:AudioContext;
  private gainNode:GainNode;

  // current time
  private _progress:number;

  // % completed
  private _completed:number;


  private onUpdate:Function;
  private onEnd:Function;

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
    this.audioCtx = new (window['AudioContext'])();
    this.volume=volume;
    this.name=name;

    // Feed the HTMLMediaElement into it
    var source = this.audioCtx.createMediaElementSource(this.audio);

    // Create a gain node
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value=volume;

    // connect the AudioBufferSourceNode to the gainNode
    // and the gainNode to the destination, so we can play the
    // music and adjust the volume using the mouse cursor
    source.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);


    this.onUpdate=update;
    this.onEnd=end;
  }

  private bindEvents(){
    this.audio.addEventListener("timeupdate", (e) => { 
      this.timeupdate()
      this.onUpdate(this.name,this._progress,this._completed); 
    }, false);
    
    this.audio.addEventListener("error", (err) => {
      console.log(`Audio error => track ${this.src}`, err);
      this.isPlaying = false;
    }, false);
    
    // this.audio.addEventListener("canplay", () => {
    //   console.log(`Loaded track ${this.src}`);
    //   this.play();
    //   //if(ready)ready(this.TRACK);
    // }, false);
    
    this.audio.addEventListener("playing", () => {
      console.log(`Playing track ${this.audio.src}`);
      this.isPlaying=true;
    }, false);
    
    this.audio.addEventListener("ended", () => {
      this.isPlaying=false;
      console.log('Finished playback');
      this.onEnd(this.name);
    });
    
    this.audio.addEventListener("durationchange", (e:any) => {    
      this.durationchange(e.target.duration);
    }, false);  
    
  }

  timeupdate(){
    if (this.isPlaying && this.audio.currentTime > 0) {
      this._progress = this.audio.currentTime;
      this._completed = this.audio.duration > 0 ? Math.trunc (this.audio.currentTime / this.audio.duration * 100)/100 : 0;
    }                
  }
  
  durationchange(duration:number){
    this.duration = duration;
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
    if(url){
      this.setSrc(url);
    }
    this.audio.volume=this.volume;
    this.gainNode.gain.value=this.volume;
    this.audio.play();
    this.bindEvents();
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
    this.mixer.forEach(mixer => mixer.play())
  }

  toggle(){

  }



}
