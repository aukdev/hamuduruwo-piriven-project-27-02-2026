import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { SuperadminSubjectsComponent } from './superadmin-subjects.component';

describe('SuperadminSubjectsComponent', () => {
  let component: SuperadminSubjectsComponent;
  let fixture: ComponentFixture<SuperadminSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuperadminSubjectsComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminSubjectsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
