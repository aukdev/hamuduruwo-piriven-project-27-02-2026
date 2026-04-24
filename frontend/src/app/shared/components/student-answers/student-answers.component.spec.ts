import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { StudentAnswersComponent } from './student-answers.component';

describe('StudentAnswersComponent', () => {
  let component: StudentAnswersComponent;
  let fixture: ComponentFixture<StudentAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudentAnswersComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentAnswersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
