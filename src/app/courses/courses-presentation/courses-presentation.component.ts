import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-courses-presentation',
  templateUrl: './courses-presentation.component.html',
  styleUrls: ['./courses-presentation.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CoursesPresentationComponent implements OnInit {

  
  private _courses : Course[];
  public get courses() : Course[] {
    return this._courses;
  }
  @Input() public set courses(v : Course[]) {
    if(v)
      this._courses= v;
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  userId(index, user) {
    debugger
    console.log({index,user})
    return user.name;
}

}
