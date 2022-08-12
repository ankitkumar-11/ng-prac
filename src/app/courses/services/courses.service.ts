import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CourseAdapter } from '../models/course.adapter';
import { Course } from '../models/course.model';
import { map } from "rxjs/internal/operators/map";

@Injectable()
export class CoursesService {

  private baseUrl = "http://localhost:3000";

  constructor(private _http:HttpClient, private _courseAdapter:CourseAdapter) { }

  public list(): Observable<Course[]> {
    const url = `${this.baseUrl}/courses`;

    return this._http.get(url).pipe(
      map((data: any[]) => data.map((item) => this._courseAdapter.adapt(item)))
    );
  }
}
