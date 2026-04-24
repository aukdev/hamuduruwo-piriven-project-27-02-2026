import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { VcharaSubjectManagementComponent } from './vichara-subject-management.component';

describe('VcharaSubjectManagementComponent', () => {
  let component: VcharaSubjectManagementComponent;
  let fixture: ComponentFixture<VcharaSubjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VcharaSubjectManagementComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VcharaSubjectManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
