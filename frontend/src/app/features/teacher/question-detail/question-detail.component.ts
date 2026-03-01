import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { QuestionDto } from '../../../core/models';

@Component({
  selector: 'app-question-detail',
  template: `
    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <div *ngIf="question && !loading">
      <app-page-header
        [title]="'ප්‍රශ්න විස්තර'"
        [subtitle]="'#' + question.id"
      >
        <button mat-stroked-button routerLink="/teacher/questions">
          <mat-icon>arrow_back</mat-icon> ආපසු
        </button>
        <button
          mat-flat-button
          color="primary"
          *ngIf="question.status === 'DRAFT' || question.status === 'REJECTED'"
          [routerLink]="['/teacher/questions/edit', question.id]"
        >
          <mat-icon>edit</mat-icon> සංස්කරණය
        </button>
      </app-page-header>

      <mat-card class="detail-card">
        <div class="detail-meta">
          <span class="status-badge status-{{ question.status }}">{{
            getStatusLabel(question.status)
          }}</span>
          <span class="meta-chip">{{ question.subjectName }}</span>
          <span class="meta-chip">{{
            question.createdAt | date: 'yyyy-MM-dd HH:mm'
          }}</span>
        </div>

        <h3 class="question-text">{{ question.questionText }}</h3>

        <div class="options-grid">
          <div
            class="option-item"
            *ngFor="let opt of question.options; let i = index"
            [class.correct]="opt.isCorrect"
          >
            <span class="option-letter">{{ getLetters()[i] }}</span>
            <span class="option-text">{{ opt.optionText }}</span>
            <mat-icon class="correct-icon" *ngIf="opt.isCorrect"
              >check_circle</mat-icon
            >
          </div>
        </div>

        <!-- Rejection Reason -->
        <div
          class="rejection-box"
          *ngIf="question.status === 'REJECTED' && question.rejectionReason"
        >
          <mat-icon>warning</mat-icon>
          <div>
            <strong>ප්‍රතික්ෂේප හේතුව</strong>
            <p>{{ question.rejectionReason }}</p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .detail-card {
        padding: 28px !important;
      }
      .detail-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        margin-bottom: 20px;
      }
      .meta-chip {
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        background: #f0f0f5;
        border-radius: 6px;
        color: #555;
      }
      .question-text {
        font-size: 17px;
        line-height: 1.8;
        color: #1a1a2e;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
      }
      .options-grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        background: #fafafa;
        transition: all 0.15s;

        &.correct {
          border-color: #2e7d32;
          background: rgba(46, 125, 50, 0.04);
        }
      }
      .option-letter {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 700;
        font-size: 14px;
        background: #e8eaf6;
        color: #0b3d91;

        .correct & {
          background: #e8f5e9;
          color: #2e7d32;
        }
      }
      .option-text {
        flex: 1;
        font-size: 14px;
        color: #333;
      }
      .correct-icon {
        color: #2e7d32;
      }
      .rejection-box {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding: 16px;
        background: rgba(198, 40, 40, 0.05);
        border-radius: 10px;
        border-left: 4px solid #c62828;

        mat-icon {
          color: #c62828;
          margin-top: 2px;
        }
        strong {
          display: block;
          color: #c62828;
          margin-bottom: 4px;
          font-size: 14px;
        }
        p {
          margin: 0;
          color: #555;
          font-size: 13px;
          line-height: 1.6;
        }
      }
    `,
  ],
})
export class QuestionDetailComponent implements OnInit {
  question: QuestionDto | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/teacher/questions']);
      return;
    }
    this.api.getQuestion(id).subscribe({
      next: (q) => {
        this.question = q;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/teacher/questions']);
      },
    });
  }

  getLetters(): string[] {
    return ['A', 'B', 'C', 'D'];
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
}
