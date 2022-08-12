import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesPresentationComponent } from './courses-presentation.component';

describe('CoursesPresentationComponent', () => {
  let component: CoursesPresentationComponent;
  let fixture: ComponentFixture<CoursesPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
