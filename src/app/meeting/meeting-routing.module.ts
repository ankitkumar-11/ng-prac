import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviewComponent } from './preview/preview.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    redirectTo:'preview'
  },
  {
    path:'preview',
    component:PreviewComponent
  },
  {
    path:'room',
    component:RoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoutingModule { }
