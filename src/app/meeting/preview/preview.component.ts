import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HMSReactiveStore } from '@100mslive/hms-video-store';
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
  public isConnected:any;

  constructor(private _meetService: MeetService, private _router:Router) {
  }

  ngOnInit(): void {
    this.userName = new FormControl(null);
    console.log("isConnected - ",this._meetService.hmsStore.getState(selectIsConnectedToRoom))
    this.isConnected = this._meetService.hmsStore.getState(selectIsConnectedToRoom);
    console.log({isConnected:this.isConnected})
    this._meetService.hmsStore.subscribe(this.onRoomStateChange, selectIsConnectedToRoom)
    // this._meetService.getToken('ankit').subscribe((res: any) => {
    //   const config = {
    //     userName: this.userName.value,
    //     authToken: res.token, // client-side token generated from your token service
    //     settings: {
    //       isAudioMuted: true,
    //       isVideoMuted: true
    //     },
    //     rememberDeviceSelection: true,  // remember manual device change
    //   };
    //   this.hmsActions.preview(config);
    // })
    // this._meetService.getManagement().subscribe(res=>{
    //   console.log(res)
    //   debugger
    // })
    // this._meetService.createRoom().subscribe(res=>{
    //   console.log(res)
    //   debugger
    // })
  }

  public async joinMeet() {
    if (this.userName.value) {
      await this._meetService.joinMeet(this.userName.value);
      this._router.navigate(['meeting/room'])
    }
  }

  public onRoomStateChange(connected){
    console.log('isConnected m - ', connected);
    // this.isConnected = connected;
  }

}
