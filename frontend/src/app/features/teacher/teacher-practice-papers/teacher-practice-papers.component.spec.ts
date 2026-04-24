import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { TeacherPracticePapersComponent } from './teacher-practice-papers.component';

describe('TeacherPracticePapersComponent', () => {
  let component: TeacherPracticePapersComponent;
  let fixture: ComponentFixture<TeacherPracticePapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TeacherPracticePapersComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherPracticePapersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
