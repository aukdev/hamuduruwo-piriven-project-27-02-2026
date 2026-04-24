import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { PracticePaperReviewComponent } from './practice-paper-review.component';

describe('PracticePaperReviewComponent', () => {
  let component: PracticePaperReviewComponent;
  let fixture: ComponentFixture<PracticePaperReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PracticePaperReviewComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticePaperReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
