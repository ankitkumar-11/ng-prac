import { HMSReactiveStore } from '@100mslive/hms-video-store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MeetService {

  private hms = new HMSReactiveStore();
  public hmsStore = this.hms.getStore();
  public hmsActions = this.hms.getActions();

  private management = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoibWFuYWdlbWVudCIsImFwcF9kYXRhIjpudWxsLCJhY2Nlc3Nfa2V5IjoiNjJmNWRlODdiMWU3ODBlNzhjM2IzN2U3IiwiZXhwIjoxNjYwNjYxNTc2LCJqdGkiOiJkNzFmYWYzMS02ODA4LTQwN2ItOTZmYi05Y2U1YjFiMTBjYWUiLCJpYXQiOjE2NjA2MjU1NzYsImlzcyI6IjYyZjVkZTg2YjFlNzgwZTc4YzNiMzdlMyIsIm5iZiI6MTY2MDYyNTU3Niwic3ViIjoiYXBpIn0.azuO8rdvfs9reADd_DbhtVyVWJVG0y5x14Ow4g2K8RM"

  private app_access_key = '62f5de86b1e780e78c3b37e6';
  private app_secret = '2vkWECXse8GN34DUlqXk6-zTEKveqXczMFD5bCnkSdXIVP0Mhvyt6-9ovNAPRpi8W2dSqxK1Ta8k6KdMjGQyeP6VnLNmW46C1NVcFIoplqBMoE6HlT_wohTwG-kZN4QmtWdTVdYfu1MVVOfdvr4u0HwciV4mEMccRXy4Gtj6KlI=';

  constructor(private _http: HttpClient) { }

  getToken(user_id: any): Observable<any> {
    let body: any = {
      user_id,
      role: 'host',
      type: 'app',
      room_id: '62f5f698c166400656971218'
    }
    return this._http.post('https://prod-in2.100ms.live/hmsapi/ankitdev.app.100ms.live/api/token', body);
  }

  joinMeet(userName) {
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

  async leaveMeet() {
    await this.hmsActions.leave();
  }

  getManagement() {
    let body: any = {
      access_key: this.app_access_key,
      type: 'management',
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    }
    return this._http.post('https://prod-in2.100ms.live/hmsapi/ankitdev.app.100ms.live/api/token', body);
  }

  createRoom() {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.management}`);
    return this._http.post('https://prod-in2.100ms.live/api/v2/rooms','', { 'headers': headers });
  }
}
