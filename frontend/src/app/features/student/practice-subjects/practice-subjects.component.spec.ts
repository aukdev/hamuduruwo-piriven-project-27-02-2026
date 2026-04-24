import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { PracticeSubjectsComponent } from './practice-subjects.component';

describe('PracticeSubjectsComponent', () => {
  let component: PracticeSubjectsComponent;
  let fixture: ComponentFixture<PracticeSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PracticeSubjectsComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeSubjectsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
