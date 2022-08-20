import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HMSReactiveStore, selectIsInPreview, selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, selectLocalPeer, selectLocalVideoTrackID } from '@100mslive/hms-video-store';
import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { MeetService } from '../meet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  public userName: FormControl;
  public isConnected: any;
  public IsInPreview;
  public audioEnabled;
  public videoEnabled;
  public displayName;

  constructor(private _meetService: MeetService, private _router: Router) {
  }

  ngOnInit(): void {
    this.userName = new FormControl(null);
    console.log("isConnected - ", this._meetService.hmsStore.getState(selectIsConnectedToRoom))
    this.isConnected = this._meetService.hmsStore.getState(selectIsConnectedToRoom);
    console.log({ isConnected: this.isConnected })
    this._meetService.hmsStore.subscribe(this.onRoomStateChange, selectIsConnectedToRoom)
    // this._meetService.previewMeet("ankit")
    // this.IsInPreview = this._meetService.hmsStore.getState(selectIsInPreview)
    // console.log("is in preview: ", this.IsInPreview)
    // this._meetService.hmsStore.subscribe(this.previewState.bind(this), selectIsInPreview)
    this._meetService.hmsStore.subscribe(this.videoState.bind(this), selectIsLocalVideoEnabled)
    this.videoEnabled = this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
    console.log("isMyVideoOn: ", this.videoEnabled)
    this.audioEnabled = this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
    console.log("isMyMicOn: ", this.audioEnabled)
  }

  onKeyUpEvent(event){
    let word = this.userName.value.trim().split(" ");
    if(word.length > 1){
      this.displayName = word[0].substr(0,1).concat(word[1].substr(0,1)).toUpperCase();
    }
    else{
      this.displayName = word[0].substr(0,2).toUpperCase();
    }
  }

  previewState(connected) {
    this.IsInPreview = connected;
    console.log("is in preview: ", this.IsInPreview)
  }


  localState(state) {
    console.log(state)
  }

  videoState(connected) {
    this.videoEnabled = connected;
    console.log("isMyVideoOn: ", this.videoEnabled)
  }

  public async joinMeet() {
    if (this.userName.value) {
      await this._meetService.joinMeetHost(this.userName.value);
      this._router.navigate(['meeting/room'])
    }
  }

  public async joinMeetGuest() {
    if (this.userName.value) {
      await this._meetService.joinMeetGuest(this.userName.value);
      this._router.navigate(['meeting/room'])
    }
  }

  public onRoomStateChange(connected) {
    console.log('isConnected m - ', connected);
    // this.isConnected = connected;
  }

  async toggleVideo() {
    this.videoEnabled = !this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
    try {
      await this._meetService.hmsActions.setLocalVideoEnabled(this.videoEnabled);
      this.videoEnabled = this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
      console.log("isMyVideoOn: try", this.videoEnabled)
    } catch (error) {
      // an error will be thrown if user didn't give access to share screen
      console.log(error)
      alert(error)
      this.videoEnabled = this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
      console.log("isMyVideoOn: catch", this.videoEnabled)
    }
  }

  async toggleAudio() {
    this.audioEnabled = !this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
    try {
      await this._meetService.hmsActions.setLocalAudioEnabled(this.audioEnabled);
      this.audioEnabled = this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
      console.log("isMyMicOn: try", this.audioEnabled)
    } catch (error) {
      // an error will be thrown if user didn't give access to share screen
      console.log(error)
      alert(error)
      this.audioEnabled = this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
      console.log("isMyMicOn: catch", this.audioEnabled)
    }
  }

}
