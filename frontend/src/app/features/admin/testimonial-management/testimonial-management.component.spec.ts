import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { TestimonialManagementComponent } from './testimonial-management.component';

describe('TestimonialManagementComponent', () => {
  let component: TestimonialManagementComponent;
  let fixture: ComponentFixture<TestimonialManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestimonialManagementComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
