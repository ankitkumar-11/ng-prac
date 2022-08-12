import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingRoutingModule } from './meeting-routing.module';
import { PreviewComponent } from './preview/preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MeetService } from './meet.service';
import { RoomComponent } from './room/room.component';


@NgModule({
  declarations: [PreviewComponent, RoomComponent],
  imports: [
    CommonModule,
    MeetingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[MeetService]
})
export class MeetingModule { }
