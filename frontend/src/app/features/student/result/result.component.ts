import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AttemptResultResponse } from '../../../core/models';

@Component({
  selector: 'app-result',
  template: `
    <app-loading-overlay
      [show]="loading"
      text="ප්‍රතිඵල පූරණය වෙමින්..."
    ></app-loading-overlay>

    <div class="result-container" *ngIf="!loading && result">
      <!-- Score Hero -->
      <mat-card class="score-hero">
        <div
          class="score-hero__circle"
          [class.good]="scorePercent >= 60"
          [class.great]="scorePercent >= 80"
        >
          <div class="score-hero__number">{{ result.score }}</div>
          <div class="score-hero__total">/{{ result.totalQuestions }}</div>
        </div>
        <h2 class="score-hero__title">{{ result.scoreMessage }}</h2>
        <div class="score-hero__badge" *ngIf="result.isNewBest">
          <mat-icon>emoji_events</mat-icon> නව ඉහළම ලකුණ!
        </div>
      </mat-card>

      <!-- Stats -->
      <div class="result-stats">
        <mat-card class="stat-card correct">
          <mat-icon>check_circle</mat-icon>
          <div class="stat-card__value">{{ result.correctCount }}</div>
          <div class="stat-card__label">නිවැරදි</div>
        </mat-card>
        <mat-card class="stat-card wrong">
          <mat-icon>cancel</mat-icon>
          <div class="stat-card__value">{{ result.wrongCount }}</div>
          <div class="stat-card__label">වැරදි</div>
        </mat-card>
        <mat-card class="stat-card unanswered">
          <mat-icon>help</mat-icon>
          <div class="stat-card__value">{{ result.unansweredCount }}</div>
          <div class="stat-card__label">පිළිතුරු නැත</div>
        </mat-card>
      </div>

      <!-- Comparison -->
      <mat-card class="comparison-card" *ngIf="result.comparisonMessage">
        <mat-icon>trending_up</mat-icon>
        <div>
          <p>{{ result.comparisonMessage }}</p>
          <small
            *ngIf="
              result.previousBestScore !== null &&
              result.previousBestScore !== undefined
            "
          >
            පෙර ඉහළම ලකුණ: {{ result.previousBestScore }}/{{
              result.totalQuestions
            }}
          </small>
        </div>
      </mat-card>

      <!-- Info -->
      <mat-card class="info-card">
        <div class="info-row">
          <span>වර්ෂය</span>
          <strong>{{ result.year }}</strong>
        </div>
        <mat-divider></mat-divider>
        <div class="info-row">
          <span>ප්‍රශ්න පත්‍ර විශය</span>
          <strong>{{ result.subjectName }}</strong>
        </div>
        <mat-divider></mat-divider>
        <div class="info-row">
          <span>උත්සාහ අංකය</span>
          <strong>{{ result.attemptNo }}/10</strong>
        </div>
        <mat-divider></mat-divider>
        <div class="info-row">
          <span>තත්ත්වය</span>
          <span class="status-badge status-{{ result.status }}">{{
            getStatusSinhala(result.status)
          }}</span>
        </div>
      </mat-card>

      <!-- Actions -->
      <div class="result-actions">
        <button mat-flat-button color="primary" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          ප්‍රශ්න පත්‍ර වෙත
        </button>
        <button mat-stroked-button color="primary" routerLink="/student/years">
          <mat-icon>calendar_today</mat-icon>
          වර්ෂ තෝරන්න
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .result-container {
        max-width: 600px;
        margin: 0 auto;
      }
      .score-hero {
        text-align: center;
        padding: 40px !important;
        margin-bottom: 20px;
      }
      .score-hero__circle {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: #fce4ec;
        border: 4px solid #c62828;
        margin-bottom: 16px;
        padding-top: 32px;

        &.good {
          background: #fff3e0;
          border-color: #f4b400;
        }
        &.great {
          background: #e8f5e9;
          border-color: #2e7d32;
        }
      }
      .score-hero__number {
        font-size: 36px;
        font-weight: 800;
        color: #1a1a2e;
      }
      .score-hero__total {
        font-size: 18px;
        font-weight: 500;
        color: #555770;
      }
      .score-hero__title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a2e;
        line-height: 1.6;
        margin-top: 8px;
      }
      .score-hero__badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        padding: 6px 16px;
        background: #f4b400;
        color: #1a1a2e;
        border-radius: 20px;
        font-weight: 700;
        font-size: 13px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
      .result-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }
      .stat-card {
        text-align: center;
        padding: 20px !important;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          margin-bottom: 8px;
        }

        &.correct mat-icon {
          color: #2e7d32;
        }
        &.wrong mat-icon {
          color: #c62828;
        }
        &.unanswered mat-icon {
          color: #555770;
        }
      }
      .stat-card__value {
        font-size: 28px;
        font-weight: 800;
        color: #1a1a2e;
      }
      .stat-card__label {
        font-size: 12px;
        color: #555770;
        margin-top: 4px;
      }
      .comparison-card {
        display: flex;
        gap: 16px;
        padding: 20px !important;
        margin-bottom: 20px;
        border-left: 4px solid #0b3d91 !important;

        mat-icon {
          color: #0b3d91;
          margin-top: 2px;
        }
        p {
          font-size: 14px;
          color: #1a1a2e;
          line-height: 1.6;
        }
        small {
          font-size: 12px;
          color: #555770;
        }
      }
      .info-card {
        padding: 8px 20px !important;
        margin-bottom: 24px;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        font-size: 14px;

        span:first-child {
          color: #555770;
        }
        strong {
          color: #1a1a2e;
        }
      }
      .result-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }

      @media (max-width: 480px) {
        .result-stats {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ResultComponent implements OnInit {
  result: AttemptResultResponse | null = null;
  loading = true;
  scorePercent = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    const attemptId = this.route.snapshot.params['attemptId'];
    this.api.getAttemptResult(attemptId).subscribe({
      next: (res) => {
        this.result = res;
        this.scorePercent = (res.score / res.totalQuestions) * 100;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getStatusSinhala(status: string): string {
    const map: Record<string, string> = {
      SUBMITTED: 'ඉදිරිපත් කළ',
      EXPIRED: 'කල් ඉකුත්',
      IN_PROGRESS: 'සිදු වෙමින්',
    };
    return map[status] || status;
  }

  goBack(): void {
    if (this.result) {
      this.router.navigate(['/student/years', this.result.year, 'papers']);
    } else {
      this.router.navigate(['/student/years']);
    }
  }
}
