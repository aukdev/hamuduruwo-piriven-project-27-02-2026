import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestionDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-superadmin-approvals',
  template: `
    <app-page-header
      title="ප්‍රශ්න අනුමැතිය"
      subtitle="සමාලෝචනය බලාපොරොත්තුවෙන් සිටින ප්‍රශ්න"
    >
    </app-page-header>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <div class="questions-list" *ngIf="!loading">
      <mat-card class="question-card" *ngFor="let q of questions">
        <div class="question-card__header">
          <span class="status-badge status-PENDING_REVIEW">සමාලෝචනයට</span>
          <span class="chip">{{ q.subjectName }}</span>
          <span class="chip author">{{ q.createdByEmail }}</span>
        </div>

        <p class="question-text">{{ q.questionText }}</p>

        <div class="options-list">
          <div
            class="option"
            *ngFor="let opt of q.options; let i = index"
            [class.correct]="opt.isCorrect"
          >
            <span class="option-letter">{{ ['A', 'B', 'C', 'D'][i] }}</span>
            <span>{{ opt.optionText }}</span>
            <mat-icon class="correct-mark" *ngIf="opt.isCorrect"
              >check_circle</mat-icon
            >
          </div>
        </div>

        <div class="question-card__actions">
          <button mat-flat-button color="primary" (click)="approve(q)">
            <mat-icon>check</mat-icon> අනුමත කරන්න
          </button>
          <button mat-stroked-button color="warn" (click)="reject(q)">
            <mat-icon>close</mat-icon> ප්‍රතික්ෂේප කරන්න
          </button>
        </div>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && questions.length === 0"
      icon="check_circle"
      title="සමාලෝචනයට ප්‍රශ්න නොමැත"
      message="සියලුම ප්‍රශ්න සමාලෝචනය කර ඇත."
    >
    </app-empty-state>

    <mat-paginator
      *ngIf="totalElements > pageSize"
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="currentPage"
      (page)="onPageChange($event)"
      [hidePageSize]="true"
    >
    </mat-paginator>
  `,
  styles: [
    `
      .questions-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .question-card {
        padding: 24px !important;
      }
      .question-card__header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }
      .chip {
        font-size: 12px;
        font-weight: 600;
        padding: 2px 8px;
        background: rgba(11, 61, 145, 0.08);
        border-radius: 4px;
        color: #0b3d91;
      }
      .chip.author {
        background: rgba(0, 0, 0, 0.05);
        color: #666;
      }
      .question-text {
        font-size: 15px;
        line-height: 1.7;
        color: #1a1a2e;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f5;
      }
      .options-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
      }
      .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        font-size: 14px;
        color: #333;

        &.correct {
          border-color: #2e7d32;
          background: rgba(46, 125, 50, 0.04);
        }
      }
      .option-letter {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 700;
        font-size: 12px;
        background: #e8eaf6;
        color: #0b3d91;

        .correct & {
          background: #e8f5e9;
          color: #2e7d32;
        }
      }
      .correct-mark {
        color: #2e7d32;
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-left: auto;
      }
      .question-card__actions {
        display: flex;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f5;
      }
    `,
  ],
})
export class SuperadminApprovalsComponent implements OnInit {
  questions: QuestionDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.api.getPendingQuestions(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.questions = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadQuestions();
  }

  approve(q: QuestionDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය අනුමත කරන්න',
        message: `"${q.questionText.substring(0, 80)}..." ප්‍රශ්නය අනුමත කිරීමට අවශ්‍යද?`,
        confirmText: 'අනුමත කරන්න',
      },
      width: '420px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.approveQuestion(q.id).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය සාර්ථකව අනුමත කරන ලදී!');
            this.loadQuestions();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'අනුමත කිරීම අසාර්ථකයි.'),
        });
      }
    });
  }

  reject(q: QuestionDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය ප්‍රතික්ෂේප කරන්න',
        message: 'ප්‍රතික්ෂේප කිරීමේ හේතුව ඇතුළත් කරන්න:',
        confirmText: 'ප්‍රතික්ෂේප කරන්න',
        dangerous: true,
        showInput: true,
        inputLabel: 'හේතුව',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result && result.inputValue) {
        this.api.rejectQuestion(q.id, { reason: result.inputValue }).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය ප්‍රතික්ෂේප කරන ලදී.');
            this.loadQuestions();
          },
          error: (err) =>
            this.notify.error(
              err.error?.message || 'ප්‍රතික්ෂේප කිරීම අසාර්ථකයි.',
            ),
        });
      }
    });
  }
}
