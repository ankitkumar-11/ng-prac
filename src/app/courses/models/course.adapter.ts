import { Injectable } from "@angular/core";
import { Adapter } from "src/app/shared/Adapter/adapter";
import { Course } from "./course.model";

@Injectable()
export class CourseAdapter implements Adapter<Course> {

    adapt(item: any): Course {
      return new Course(
        item.id,
        item.code,
        item.name,
        new Date(item.created),
      );
    }
  }