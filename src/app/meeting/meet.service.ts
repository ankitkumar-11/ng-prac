import { HMSReactiveStore } from '@100mslive/hms-video-store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MeetService {

  private hms = new HMSReactiveStore();
  public hmsStore = this.hms.getStore();
  public hmsActions = this.hms.getActions();

  constructor(private _http:HttpClient) { }

  getToken(user_id:any):Observable<any>{
    let body:any = {
      user_id,
      role:'host',
      type:'app',
      room_id:'62f5f698c166400656971218'
    }
    return this._http.post('https://prod-in2.100ms.live/hmsapi/ankitdev.app.100ms.live/api/token',body);
  }

  joinMeet(userName){
    this.getToken(userName).subscribe(async (res: any) => {
      const config = {
        userName,
        authToken: res.token, // client-side token generated from your token service
        settings: {
          isAudioMuted: true,
          isVideoMuted: true
        },
        rememberDeviceSelection: true,  // remember manual device change
      };
      await this.hmsActions.join(config)
    })
  }

  async leaveMeet(){
    await this.hmsActions.leave();
  }
}
