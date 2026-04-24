import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { PracticePaperApprovalsComponent } from './practice-paper-approvals.component';

describe('PracticePaperApprovalsComponent', () => {
  let component: PracticePaperApprovalsComponent;
  let fixture: ComponentFixture<PracticePaperApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PracticePaperApprovalsComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticePaperApprovalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
