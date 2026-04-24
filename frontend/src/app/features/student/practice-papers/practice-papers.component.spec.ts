import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


import { PracticePapersComponent } from './practice-papers.component';

describe('PracticePapersComponent', () => {
  let component: PracticePapersComponent;
  let fixture: ComponentFixture<PracticePapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PracticePapersComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticePapersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
