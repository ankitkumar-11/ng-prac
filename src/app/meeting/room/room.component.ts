import { Component, OnInit } from '@angular/core';
import { HMSReactiveStore, selectPeers } from '@100mslive/hms-video-store';
import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { MeetService } from '../meet.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public peers = [];
  public isConnected:boolean = false;
  constructor(private _meetService:MeetService) { }
  public sub1:Subscription;
  public sub2:Subscription;


  ngOnInit(): void {
    console.log("isConnected - ",this._meetService.hmsStore.getState(selectIsConnectedToRoom))
    this._meetService.hmsStore.subscribe(this.onRoomStateChange, selectIsConnectedToRoom)
    this._meetService.hmsStore.subscribe(this.renderPeers, selectPeers);
  }

  public onRoomStateChange(connected){
    console.log('isConnected m - ', connected);
  }

  public renderPeers(peers){
    // this.peers = Array.from(peers);
    if(peers.length !=0){
      const peersContainer = document.getElementById('peers-container');
      peersContainer.innerHTML = '';
      debugger
      peers.forEach((peer) => {
        this.peers.push(peer)
        // peersContainer.append(this.renderVideo(peer)as any);
      });
    }
  }

  public leaveMeet(){
    this._meetService.leaveMeet();
  }

  renderVideo(peer) {
    debugger
    // you can either get an existing video element or create a new onw.
    // const videoElement = document.getElementByID(peer.id)
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsinline = true;

    this._meetService.hmsActions.attachVideo(peer.videoTrack, videoElement);
}

}
