import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { SuperadminUsersComponent } from './superadmin-users.component';

describe('SuperadminUsersComponent', () => {
  let component: SuperadminUsersComponent;
  let fixture: ComponentFixture<SuperadminUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuperadminUsersComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
