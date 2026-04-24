import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { VcharaManagementComponent } from './vichara-management.component';

describe('VcharaManagementComponent', () => {
  let component: VcharaManagementComponent;
  let fixture: ComponentFixture<VcharaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VcharaManagementComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VcharaManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
