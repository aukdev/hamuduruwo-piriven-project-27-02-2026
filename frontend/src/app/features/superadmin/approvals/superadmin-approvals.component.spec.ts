import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { SuperadminApprovalsComponent } from './superadmin-approvals.component';

describe('SuperadminApprovalsComponent', () => {
  let component: SuperadminApprovalsComponent;
  let fixture: ComponentFixture<SuperadminApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuperadminApprovalsComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminApprovalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
