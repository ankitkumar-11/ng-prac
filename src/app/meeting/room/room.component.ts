import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HMSReactiveStore, selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, selectPeers, selectPeersScreenSharing, selectScreenShareByPeerID } from '@100mslive/hms-video-store';
import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { MeetService } from '../meet.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public peers: any;
  public isConnected: boolean = false;
  constructor(private _meetService: MeetService) { }
  public sub1: Subscription;
  public sub2: Subscription;
  @ViewChild("peersContainer", { static: true }) peersContainer: ElementRef;
  @ViewChild("peersScreenContainer", { static: true }) peersScreenContainer: ElementRef;  
  private hms = new HMSReactiveStore();
  public hmsActions = this.hms.getActions();
  public audioEnabled;
  public videoEnabled;

  ngOnInit(): void {
    console.log("isConnected - ", this._meetService.hmsStore.getState(selectIsConnectedToRoom))
    this._meetService.hmsStore.subscribe(this.onRoomStateChange, selectIsConnectedToRoom)
    this._meetService.hmsStore.subscribe(this.renderPeers.bind(this), selectPeers);
    const presenters = this._meetService.hmsStore.getState(selectPeersScreenSharing);
    this._meetService.hmsStore.subscribe(this.renderPeersScreen.bind(this), selectPeersScreenSharing);
    this.audioEnabled = this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
    this.videoEnabled = this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
  }

  ngAfterViewInit(): void {
  }

  public onRoomStateChange(connected) {
    console.log('isConnected m - ', connected);
  }

  renderPeers(peers: any[]) {
    console.log(this.peersContainer.nativeElement)
    // 1. clear the peersContainer
    if (!peers) {
      peers = this._meetService.hmsStore.getState(selectPeers);
    }
    console.log(peers)
    this.peersContainer.nativeElement.innerHTML = "";
    // 2. loop through the peers and render a tile for each peer
    peers.forEach((peer) => {
      const videoElement = this.h("video", {
        class: "peer-video" + (peer.isLocal ? " local" : ""),
        autoplay: true,
        muted: true,
        playsinline: true,
      });

      if(peer.videoTrack){
        this._meetService.hmsActions.attachVideo(peer.videoTrack, videoElement);
      }

      const peerContainer = this.h(
        "div",
        {
          class: "peer-container"
        },
        videoElement,
        this.h(
          "div",
          {
            class: "peer-name"
          },
          peer.name + (peer.isLocal ? " (You)" : "")
        )
      );
      this.peersContainer.nativeElement.appendChild(peerContainer);
    });
  }

  public leaveMeet() {
    this._meetService.leaveMeet();
  }

  // helper function to create html elements
  h(tag: any, attrs: any, ...children: any[]) {
    const newElement = document.createElement(tag);

    Object.keys(attrs).forEach((key) => {
      newElement.setAttribute(key, attrs[key]);
    });
    children.forEach((child) => {
      newElement.append(child);
    });
    return newElement;
  }

  async shareScreen() {
    try {
      await this._meetService.hmsActions.setScreenShareEnabled(true);
    } catch (error) {
      // an error will be thrown if user didn't give access to share screen
      console.log(error)
    }
  }

  async stopScreen() {
    try {
      await this._meetService.hmsActions.setScreenShareEnabled(false);
    } catch (error) {
      // an error will be thrown if user didn't give access to share screen
      console.log(error)
    }
  }

  renderPeersScreen(presenters){
    // 1. clear the peersContainer
    if (!presenters) {
      presenters = this._meetService.hmsStore.getState(selectPeersScreenSharing);
    }
    this.peersScreenContainer.nativeElement.innerHTML = "";
    // 2. loop through the peers and render a tile for each peer
    presenters.forEach((presenter) => {
      const videoElement = this.h("video", {
        class: "presenter-video",
        autoplay: true,
        muted: true,
        playsinline: true,
      });
      this._meetService.hmsActions.attachVideo(presenter.auxiliaryTracks[0], videoElement);
      const peerScreenContainer = this.h(
        "div",
        {
          class: "presenter-container"
        },
        videoElement,
        this.h(
          "div",
          {
            class: "presenter-name"
          },
          presenter.name + " (Screen)" 
        )
      );
      this.peersScreenContainer.nativeElement.appendChild(peerScreenContainer);
    });
  }

  toggleVideo(){
    console.log("V");
  }

  toggleAudio(){
    console.log("A");
  }

}
