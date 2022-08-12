import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CoursesService } from './services/courses.service';
import { CourseAdapter } from './models/course.adapter';
import { CoursesPresentationComponent } from './courses-presentation/courses-presentation.component';


@NgModule({
  declarations: [CoursesComponent, CoursesPresentationComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule
  ],
  providers:[CoursesService,CourseAdapter]
})
export class CoursesModule { }
