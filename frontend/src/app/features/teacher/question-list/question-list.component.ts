import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestionDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-question-list',
  template: `
    <app-page-header
      title="මගේ ප්‍රශ්න"
      subtitle="ඔබ සාදන ලද ප්‍රශ්න ලැයිස්තුව"
    >
      <button
        mat-flat-button
        color="primary"
        routerLink="/teacher/questions/create"
      >
        <mat-icon>add</mat-icon> නව ප්‍රශ්නයක්
      </button>
    </app-page-header>

    <!-- Filter Tabs -->
    <mat-tab-group
      (selectedTabChange)="filterByStatus($event.index)"
      class="mb-24"
    >
      <mat-tab label="සියල්ලම ({{ questions.length }})"></mat-tab>
      <mat-tab label="කෙටුම්පත් ({{ getCount('DRAFT') }})"></mat-tab>
      <mat-tab label="සමාලෝචනයට ({{ getCount('PENDING_REVIEW') }})"></mat-tab>
      <mat-tab label="අනුමත ({{ getCount('APPROVED') }})"></mat-tab>
      <mat-tab label="ප්‍රතික්ෂේප ({{ getCount('REJECTED') }})"></mat-tab>
    </mat-tab-group>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <!-- Questions List -->
    <div class="questions-list" *ngIf="!loading">
      <mat-card
        class="question-item"
        *ngFor="let q of filteredQuestions"
        (click)="viewQuestion(q)"
      >
        <div class="question-item__header">
          <span class="status-badge status-{{ q.status }}">{{
            getStatusLabel(q.status)
          }}</span>
          <span class="question-item__subject">{{ q.subjectName }}</span>
          <span class="question-item__year">{{ q.year }}</span>
          <span class="question-item__paper" *ngIf="q.paperId">
            <mat-icon>description</mat-icon> පත්‍රයට පවරා ඇත
          </span>
          <span class="question-item__no-paper" *ngIf="!q.paperId">
            <mat-icon>warning</mat-icon> පත්‍රයක් නැත
          </span>
        </div>
        <p class="question-item__text">{{ q.questionText }}</p>
        <div class="question-item__footer">
          <span class="text-muted">{{
            q.createdAt | date: 'yyyy-MM-dd HH:mm'
          }}</span>
          <div class="question-item__actions">
            <!-- Edit (only DRAFT/REJECTED) -->
            <button
              mat-icon-button
              *ngIf="q.status === 'DRAFT' || q.status === 'REJECTED'"
              (click)="editQuestion(q, $event)"
              matTooltip="සංස්කරණය"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <!-- Submit for review (only DRAFT) -->
            <button
              mat-icon-button
              *ngIf="q.status === 'DRAFT'"
              (click)="submitForReview(q, $event)"
              matTooltip="සමාලෝචනයට ඉදිරිපත් කරන්න"
              color="primary"
            >
              <mat-icon>send</mat-icon>
            </button>
          </div>
        </div>
        <!-- Rejection reason -->
        <div
          class="rejection-reason"
          *ngIf="q.status === 'REJECTED' && q.rejectionReason"
        >
          <mat-icon>warning</mat-icon>
          <span>ප්‍රතික්ෂේප හේතුව: {{ q.rejectionReason }}</span>
        </div>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && filteredQuestions.length === 0"
      icon="quiz"
      title="ප්‍රශ්න නොමැත"
      message="මෙම ප්‍රවර්ගයේ ප්‍රශ්න නොමැත."
    >
      <button
        mat-flat-button
        color="primary"
        routerLink="/teacher/questions/create"
        class="mt-16"
      >
        <mat-icon>add</mat-icon> නව ප්‍රශ්නයක් සාදන්න
      </button>
    </app-empty-state>
  `,
  styles: [
    `
      .questions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .question-item {
        padding: 20px !important;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          border-color: #0b3d91;
        }
      }
      .question-item__header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }
      .question-item__subject {
        font-size: 12px;
        font-weight: 600;
        color: #0b3d91;
        background: rgba(11, 61, 145, 0.08);
        padding: 2px 8px;
        border-radius: 4px;
      }
      .question-item__year {
        font-size: 12px;
        font-weight: 600;
        color: #2e7d32;
        background: rgba(46, 125, 50, 0.08);
        padding: 2px 8px;
        border-radius: 4px;
      }
      .question-item__paper {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 600;
        color: #2e7d32;
        background: rgba(46, 125, 50, 0.06);
        padding: 2px 8px;
        border-radius: 4px;
        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }
      .question-item__no-paper {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 600;
        color: #e65100;
        background: rgba(255, 152, 0, 0.08);
        padding: 2px 8px;
        border-radius: 4px;
        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }
      .question-item__text {
        font-size: 15px;
        line-height: 1.6;
        color: #1a1a2e;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .question-item__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .question-item__actions {
        display: flex;
        gap: 4px;
      }
      .rejection-reason {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 12px;
        padding: 12px;
        background: rgba(198, 40, 40, 0.05);
        border-radius: 8px;
        border-left: 3px solid #c62828;

        mat-icon {
          color: #c62828;
          font-size: 18px;
          width: 18px;
          height: 18px;
          margin-top: 2px;
        }
        span {
          font-size: 13px;
          color: #c62828;
          line-height: 1.5;
        }
      }
    `,
  ],
})
export class QuestionListComponent implements OnInit {
  questions: QuestionDto[] = [];
  filteredQuestions: QuestionDto[] = [];
  loading = true;
  currentFilter = 'ALL';

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.api.getMyQuestions(0, 200).subscribe({
      next: (res) => {
        this.questions = res.content;
        this.applyFilter();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterByStatus(index: number): void {
    const statuses = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'];
    this.currentFilter = statuses[index];
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.currentFilter === 'ALL') {
      this.filteredQuestions = this.questions;
    } else {
      this.filteredQuestions = this.questions.filter(
        (q) => q.status === this.currentFilter,
      );
    }
  }

  getCount(status: string): number {
    return this.questions.filter((q) => q.status === status).length;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      DRAFT: 'කෙටුම්පත',
      PENDING_REVIEW: 'සමාලෝචනයට',
      APPROVED: 'අනුමත',
      REJECTED: 'ප්‍රතික්ෂේප',
    };
    return map[status] || status;
  }

  viewQuestion(q: QuestionDto): void {
    this.router.navigate(['/teacher/questions', q.id]);
  }

  editQuestion(q: QuestionDto, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/teacher/questions/edit', q.id]);
  }

  submitForReview(q: QuestionDto, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'සමාලෝචනයට ඉදිරිපත් කරන්න',
        message:
          'මෙම ප්‍රශ්නය සමාලෝචනය සඳහා ඉදිරිපත් කිරීමට අවශ්‍යද? ඉදිරිපත් කළ පසු සංස්කරණය කළ නොහැක.',
        confirmText: 'ඉදිරිපත් කරන්න',
      },
      width: '400px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.submitQuestion(q.id).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය සමාලෝචනයට ඉදිරිපත් කරන ලදී!');
            this.loadQuestions();
          },
          error: (err) => {
            this.notify.error(
              err.error?.message || 'ඉදිරිපත් කිරීම අසාර්ථකයි.',
            );
          },
        });
      }
    });
  }
}
