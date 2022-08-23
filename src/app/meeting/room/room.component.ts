import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HMSNotificationTypes, HMSReactiveStore, selectBroadcastMessages, selectHMSMessages, selectIsLocalAudioEnabled, selectIsLocalScreenShared, selectIsLocalVideoEnabled, selectIsPeerAudioEnabled, selectIsPeerVideoEnabled, selectIsSomeoneScreenSharing, selectMessagesByPeerID, selectMessagesByRole, selectPeers, selectPeerScreenSharing, selectPeersScreenSharing, selectScreenShareByPeerID } from '@100mslive/hms-video-store';
import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { MeetService } from '../meet.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public peers: any;
  public isConnected: boolean = false;
  public sub1: Subscription;
  public sub2: Subscription;
  @ViewChild("peersContainer", { static: true }) peersContainer: ElementRef;
  @ViewChild("peersScreenContainer", { static: true }) peersScreenContainer: ElementRef;
  private hms = new HMSReactiveStore();
  public audioEnabled;
  public videoEnabled;
  public amIScreenSharing;
  public chatList: any[];

  public messageInput: FormControl;

  constructor(private _meetService: MeetService) {
    this.messageInput = new FormControl(null)
  }

  ngOnInit(): void {
    console.log("isConnected - ", this._meetService.hmsStore.getState(selectIsConnectedToRoom))
    this._meetService.hmsStore.subscribe(this.onRoomStateChange, selectIsConnectedToRoom)
    this._meetService.hmsStore.subscribe(this.renderPeers.bind(this), selectPeers);
    const presenters = this._meetService.hmsStore.getState(selectPeerScreenSharing);
    this._meetService.hmsStore.subscribe(this.renderPeersScreen.bind(this), selectPeerScreenSharing);
    this.audioEnabled = this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
    this.videoEnabled = this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
    this.amIScreenSharing = this._meetService.hmsStore.getState(selectIsLocalScreenShared);
    console.log("amIScreenSharing :", this.amIScreenSharing)
    this._meetService.hmsStore.subscribe(this.screenShareState.bind(this), selectIsLocalScreenShared)
    this._meetService.hmsStore.subscribe(this.videoState.bind(this), selectIsLocalVideoEnabled)
    this.videoEnabled = this._meetService.hmsStore.getState(selectIsLocalVideoEnabled);
    console.log("isMyVideoOn: ", this.videoEnabled)
    this.audioEnabled = this._meetService.hmsStore.getState(selectIsLocalAudioEnabled);
    console.log("isMyMicOn: ", this.audioEnabled)

    //messages
    this._meetService.hmsStore.subscribe(this.renderMessages.bind(this), selectHMSMessages); // get all messages
    this._meetService.hmsStore.subscribe(this.renderMessages.bind(this), selectBroadcastMessages); // get all broadcasted messages
    this._meetService.hmsStore.subscribe(this.renderMessages.bind(this), selectMessagesByRole('host')); // get conversation with the host role

    //notification
    this._meetService.hmsNotifications.onNotification(this.onNotification)
  }

  ngAfterViewInit(): void {
  }

  public onRoomStateChange(connected) {
    console.log('isConnected m - ', connected);
  }

  renderMessages(chatList: any[]) {
    console.log(chatList);
    this.chatList = chatList
    // chatList.forEach((chat) => {
    //   const messageElement = this.h(
    //     'div',
    //     {
    //       class: "message-container"
    //     },
    //     this.h('div',{class:'d-flex'},this.h('p',{class:'d-flex'},chat.)
    //   );
    //   // this._meetService.hmsActions.attachVideo(peer.videoTrack, videoElement);
    //   // peerContainer = this.h(
    //   //   "div",
    //   //   {
    //   //     class: "peer-container"
    //   //   },
    //   //   videoElement,
    //   //   this.h(
    //   //     "div",
    //   //     {
    //   //       class: "peer-name"
    //   //     },
    //   //     peer.name + (peer.isLocal ? " (You)" : "")
    //   //   )
    //   // );

    //   this.peersContainer.nativeElement.appendChild(peerContainer);
    // });
  }

  renderPeers(peers?: any[]) {
    // 1. clear the peersContainer
    if (!peers) {
      peers = this._meetService.hmsStore.getState(selectPeers);
    }
    console.log(peers)
    this.peersContainer.nativeElement.innerHTML = "";
    // 2. loop through the peers and render a tile for each peer
    peers.forEach(async (peer) => {
      let peerAudioEnable =  this._meetService.hmsStore.getState(selectIsPeerAudioEnabled(peer.id))
      let peerVideoEnable =  this._meetService.hmsStore.getState(selectIsPeerVideoEnabled(peer.id))

      const videoElement = this.h("video", {
        class: "peer-video" + (peer.isLocal ? " local" : ""),
        autoplay: true,
        muted: true,
        playsinline: true,
      });

      const audioElement = this.h("i", {
        class: "bx " + (peerAudioEnable ? "bxs-microphone" : "bxs-microphone-off"),
      });

      const nameElement = this.h("div",
        {
          class: "preview-name-container"
        },
        this.h(
          "div",
          {
            class: "preview-name"
          },
          peer.name.substr(0, 2)
        ));


      console.log(`${peer.name} video:-${peerVideoEnable} audio:-${peerAudioEnable}`)
      this._meetService.hmsActions.attachVideo(peer.videoTrack, videoElement);
      const peerContainer = this.h(
        "div",
        {
          class: "peer-container"
        },
        peerVideoEnable ? videoElement : nameElement,
        this.h(
          "div",
          {
            class: "peer-name"
          },
          peer.name + (peer.isLocal ? " (You)" : "")
        ),
        this.h(
          "div",
          {
            class: "peer-audio " + (peerAudioEnable ? "bg-success" : "bg-danger")
          },
          audioElement
        )
      );

      this.peersContainer.nativeElement.appendChild(peerContainer);
      this.renderPeersScreen();
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

  screenShareState(connected) {
    this.amIScreenSharing = connected;
  }

  videoState(connected) {
    this.videoEnabled = connected;
    console.log("isMyVideoOn: ", this.videoEnabled)
  }

  async toggleShareScreen() {
    try {
      const screenshareOn = this._meetService.hmsStore.getState(selectIsSomeoneScreenSharing);
      if (this.amIScreenSharing) {
        await this._meetService.hmsActions.setScreenShareEnabled(false);
      } else {
        if(!screenshareOn){
        await this._meetService.hmsActions.setScreenShareEnabled(true);
        }
        else{
          alert("someone is already sharing screen")
        }
      }
    } catch (error) {
      // an error will be thrown if user didn't give access to share screen
      console.log(error)
    }
  }

  renderPeersScreen(presenter?: any) {
    // 1. clear the peersContainer
    // console.log(presenter, "presenters")
    if (!presenter) {
      presenter = this._meetService.hmsStore.getState(selectPeerScreenSharing);
    }
    console.log(presenter, "presenters")
    this.peersScreenContainer.nativeElement.innerHTML = "";
    // 2. loop through the peers and render a tile for each peer
    if (presenter) {
      // presenters.forEach((presenter) => {
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
      // });
    }
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
    this.renderPeers();
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

  async sendMessage() {
    if (this.messageInput.value) {
      await this._meetService.hmsActions.sendBroadcastMessage(this.messageInput.value);
      this.messageInput.reset()
    }
  }

  onNotification(notification) {
    // This function will be called when a notification is received
    console.log('notification type', notification.type);

    // The data in notification depends on the notification type
    console.log('data', notification.data);

    // you can use the following to show appropriate toast notifications for eg.
    switch (notification.type) {
      // case HMSNotificationTypes.PEER_LIST:
      //   console.log(`${notification.data} are the peers in the room`); // received right after join
      //   break;
      case HMSNotificationTypes.PEER_JOINED:
        console.log(`${notification.data.name} joined`);
        break;
      case HMSNotificationTypes.PEER_LEFT:
        console.log(`${notification.data.name} left`);
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        console.log(
          `${notification.data.message} received from ${notification.data.senderName}`
        );
        break;
      case HMSNotificationTypes.ERROR:
        console.log('[Error]', notification.data);
        console.log('[Error Code]', notification.data.code);
        break;
      case HMSNotificationTypes.RECONNECTING:
        console.log('[Reconnecting]', notification.data);
        break;
      case HMSNotificationTypes.RECONNECTED:
        console.log('[Reconnected]');
        break;
      // case HMSNotificationTypes.NAME_UPDATED:
      // case HMSNotificationTypes.METADATA_UPDATED:
      case HMSNotificationTypes.ROLE_UPDATED:
        console.log(`peer updated(${notification.type}), new peer=`, notification.data);
        break;
      // case HMSNotificationTypes.T:
      //   console.log(`track - ${notification.data} degraded due to poor network`);
      //   break;
      // case HMSNotificationTypes.TRACK_RESTORED:
      //   console.log(`track - ${notification.data} recovered`);
      //   break;
      case HMSNotificationTypes.ROOM_ENDED:
        console.log(`room ended, reason - ${notification.data.reason}`);
        break;
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
        console.log(`removed from room, reason - ${notification.data.reason}`);
        break;
      case HMSNotificationTypes.DEVICE_CHANGE_UPDATE:
        console.log(`device changed - ${notification.data}`);
        break;
      default:
        break;
    }
  }

}
