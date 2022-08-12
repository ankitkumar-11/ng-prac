import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from './models/course.model';
import { CoursesService } from './services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CoursesComponent implements OnInit {

  public courses$: Observable<Course[]>;
  constructor(private _coursesService:CoursesService) { 
  }

  ngOnInit(): void {
    this.courses$ = this._coursesService.list()
  }

}
