import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { TeacherPapersComponent } from './teacher-papers.component';

describe('TeacherPapersComponent', () => {
  let component: TeacherPapersComponent;
  let fixture: ComponentFixture<TeacherPapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TeacherPapersComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherPapersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
