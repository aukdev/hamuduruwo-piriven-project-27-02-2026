import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto, PaperDetailDto, SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-paper-management',
  template: `
    <app-page-header
      title="පත්‍ර කළමනාකරණය"
      subtitle="පත්‍රවලට ප්‍රශ්න පැවරීම"
    ></app-page-header>

    <!-- Step 1: Select Year and Paper -->
    <mat-card class="select-card mb-16">
      <h3 class="card-title">
        <mat-icon>calendar_today</mat-icon> පත්‍රයක් තෝරන්න
      </h3>
      <div class="select-row">
        <mat-form-field appearance="outline">
          <mat-label>වර්ෂය</mat-label>
          <mat-select
            [(value)]="selectedYear"
            (selectionChange)="onYearChange()"
          >
            <mat-option *ngFor="let y of years" [value]="y">{{ y }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" *ngIf="papers.length > 0">
          <mat-label>පත්‍රය</mat-label>
          <mat-select
            [(value)]="selectedPaperId"
            (selectionChange)="onPaperChange()"
          >
            <mat-option *ngFor="let p of papers" [value]="p.id">
              පත්‍ර {{ p.paperNo }} ({{ p.assignedQuestions }}/{{
                p.questionCount
              }})
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-card>

    <app-loading-overlay [show]="loadingDetail"></app-loading-overlay>

    <!-- Paper Detail -->
    <div *ngIf="paperDetail && !loadingDetail">
      <mat-card class="detail-card mb-16">
        <h3 class="card-title">
          <mat-icon>assignment</mat-icon>
          {{ paperDetail.year }} - පත්‍ර {{ paperDetail.paperNo }}
          <span class="progress-label">
            {{ paperDetail.questions.length }}/{{
              paperDetail.questionCount
            }}
            ප්‍රශ්න පවරා ඇත
          </span>
        </h3>

        <mat-progress-bar
          mode="determinate"
          [value]="
            (paperDetail.questions.length / paperDetail.questionCount) * 100
          "
        >
        </mat-progress-bar>

        <!-- Assigned Questions -->
        <div
          class="assigned-list mt-16"
          *ngIf="paperDetail.questions.length > 0"
        >
          <div class="assigned-item" *ngFor="let pq of paperDetail.questions">
            <span class="position">#{{ pq.position }}</span>
            <span class="q-text">{{ pq.questionText }}</span>
            <span class="q-subject">{{ pq.subjectName }}</span>
          </div>
        </div>
        <p *ngIf="paperDetail.questions.length === 0" class="text-muted mt-12">
          තවම ප්‍රශ්න පවරා නොමැත.
        </p>
      </mat-card>

      <!-- Assign Question Form -->
      <mat-card class="assign-card">
        <h3 class="card-title">
          <mat-icon>add_link</mat-icon> ප්‍රශ්නයක් පවරන්න
        </h3>
        <form [formGroup]="assignForm" (ngSubmit)="assignQuestion()">
          <div class="assign-row">
            <mat-form-field appearance="outline">
              <mat-label>ප්‍රශ්න ID</mat-label>
              <input
                matInput
                formControlName="questionId"
                placeholder="අනුමත ප්‍රශ්නයේ ID"
              />
              <mat-error>ප්‍රශ්න ID අවශ්‍යයි</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>ස්ථානය (Position)</mat-label>
              <input
                matInput
                formControlName="position"
                type="number"
                placeholder="1-40"
              />
              <mat-error
                >1-{{ paperDetail.questionCount }} අතර අංකයක්</mat-error
              >
            </mat-form-field>
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="assignForm.invalid || assigning"
            >
              <mat-icon>add</mat-icon> පවරන්න
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .select-card,
      .detail-card,
      .assign-card {
        padding: 24px !important;
      }
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: #0b3d91;
        margin: 0 0 16px;
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
      .progress-label {
        margin-left: auto;
        font-size: 13px;
        color: #666;
        font-weight: 400;
      }
      .select-row,
      .assign-row {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        flex-wrap: wrap;
        mat-form-field {
          min-width: 180px;
        }
      }
      .assign-row button {
        margin-top: 8px;
      }
      .assigned-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .assigned-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e8e8e8;
      }
      .position {
        font-weight: 700;
        color: #0b3d91;
        font-size: 14px;
        min-width: 30px;
      }
      .q-text {
        flex: 1;
        font-size: 13px;
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .q-subject {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        background: rgba(11, 61, 145, 0.08);
        border-radius: 4px;
        color: #0b3d91;
      }
    `,
  ],
})
export class PaperManagementComponent implements OnInit {
  years: number[] = [];
  papers: PaperDto[] = [];
  selectedYear: number | null = null;
  selectedPaperId: string | null = null;
  paperDetail: PaperDetailDto | null = null;
  loadingDetail = false;
  assigning = false;
  assignForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notify: NotificationService,
  ) {
    this.assignForm = this.fb.group({
      questionId: ['', Validators.required],
      position: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.api.getYears().subscribe({
      next: (y) => (this.years = y.sort((a, b) => b - a)),
      error: () => {},
    });
  }

  onYearChange(): void {
    if (!this.selectedYear) return;
    this.paperDetail = null;
    this.selectedPaperId = null;
    this.api.getPapersByYear(this.selectedYear).subscribe({
      next: (p) => (this.papers = p),
      error: () => (this.papers = []),
    });
  }

  onPaperChange(): void {
    if (!this.selectedPaperId) return;
    this.loadPaperDetail();
  }

  loadPaperDetail(): void {
    if (!this.selectedPaperId) return;
    this.loadingDetail = true;
    this.api.getPaperDetail(this.selectedPaperId).subscribe({
      next: (d) => {
        this.paperDetail = d;
        this.loadingDetail = false;
      },
      error: () => (this.loadingDetail = false),
    });
  }

  assignQuestion(): void {
    if (this.assignForm.invalid || !this.selectedPaperId) return;
    this.assigning = true;
    this.api
      .assignQuestionToPaper(this.selectedPaperId, this.assignForm.value)
      .subscribe({
        next: () => {
          this.notify.success('ප්‍රශ්නය සාර්ථකව පත්‍රයට පවරන ලදී!');
          this.assignForm.reset();
          this.loadPaperDetail();
          this.assigning = false;
        },
        error: (err) => {
          this.notify.error(err.error?.message || 'පවරීම අසාර්ථකයි.');
          this.assigning = false;
        },
      });
  }
}
