import { HMSReactiveStore, selectIsLocalAudioEnabled, selectIsLocalVideoEnabled } from '@100mslive/hms-video-store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MeetService {

  private hms = new HMSReactiveStore();
  public hmsStore = this.hms.getStore();
  public hmsActions = this.hms.getActions();
  public hmsNotifications = this.hms.getNotifications();

  public IsLocalAudioEnabled:boolean=false;
  public IsLocalVideoEnabled:boolean=true;
  private managementToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3Nfa2V5IjoiNjJmNWRlODZiMWU3ODBlNzhjM2IzN2U2IiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJpYXQiOjE2NjA5NzMxNTgsIm5iZiI6MTY2MDk3MzE1OCwiZXhwIjoxNjYxMDU5NTU4LCJqdGkiOiIyNGRkNjVhMC1kNDMyLTQwMTMtYTFhNS1kNTAzMGE3ZDRhZDIifQ.r0lWo6DRAjA-iusC7LLExh1ijh9Cs7kfGEA0Z0DUTa4";
  private app_access_key = '62f5de86b1e780e78c3b37e6';
  private app_secret = '2vkWECXse8GN34DUlqXk6-zTEKveqXczMFD5bCnkSdXIVP0Mhvyt6-9ovNAPRpi8W2dSqxK1Ta8k6KdMjGQyeP6VnLNmW46C1NVcFIoplqBMoE6HlT_wohTwG-kZN4QmtWdTVdYfu1MVVOfdvr4u0HwciV4mEMccRXy4Gtj6KlI=';

  constructor(private _http: HttpClient) { 
    
  }

  getTokenHost(user_id: any): Observable<any> {
    let body: any = {
      user_id,
      role: 'host',
      type: 'app',
      room_id: '630091f6b1e780e78c3bc9de'
    }
    return this._http.post('https://prod-in2.100ms.live/hmsapi/ankitdev.app.100ms.live/api/token', body);
  }

  getTokenGuest(user_id: any): Observable<any> {
    let body: any = {
      user_id,
      role: 'guest',
      type: 'app',
      room_id: '630091f6b1e780e78c3bc9de'
    }
    return this._http.post('https://prod-in2.100ms.live/hmsapi/ankitdev.app.100ms.live/api/token', body);
  }

  joinMeetHost(userName) {
    this.getTokenHost(userName).subscribe(async (res: any) => {
      const config = {
        userName,
        authToken: res.token, // client-side token generated from your token service
        settings: {
          isAudioMuted: this.IsLocalAudioEnabled,
          isVideoMuted: this.IsLocalVideoEnabled
        },
        rememberDeviceSelection: true,  // remember manual device change
      };
      console.log(res);
      await this.hmsActions.join(config)
    })
  }

  joinMeetGuest(userName) {
    this.getTokenGuest(userName).subscribe(async (res: any) => {
      const config = {
        userName,
        authToken: res.token, // client-side token generated from your token service
        settings: {
          isAudioMuted: this.IsLocalAudioEnabled,
          isVideoMuted: this.IsLocalVideoEnabled
        },
        rememberDeviceSelection: true,  // remember manual device change
      };
      console.log(res);
      await this.hmsActions.join(config)
    })
  }

  previewMeet(userName) {
    this.getTokenHost(userName).subscribe(async (res: any) => {
      const config = {
        userName,
        authToken: res.token, // client-side token generated from your token service
        settings: {
          isAudioMuted: true,
          isVideoMuted: false
        },
        rememberDeviceSelection: true,  // remember manual device change
      };
      console.log(res);
      await this.hmsActions.preview(config)
    })
  }

  async leaveMeet() {
    await this.hmsActions.leave();
  }

  // createRoom() {
  //   const headers = new HttpHeaders()
  //     .set('Content-type', 'application/json')
  //     .set('Authorization', `Bearer ${this.managementToken}`)

  //     let obj = {
  //       name:"Test room",
  //       description:"test room"
  //     }
  //   return this._http.post('https://prod-in2.100ms.live/api/v2/rooms',obj, { 'headers': headers });  
  // }
}
