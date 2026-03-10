import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  StudentAttemptSummaryDto,
  AttemptDetailDto,
  AttemptAnswerDetailDto,
  PagedResponse,
  PaperDto,
  UserDto,
} from '../../../core/models';

@Component({
  selector: 'app-student-answers',
  template: `
    <app-page-header
      title="ශිෂ්‍ය පිළිතුරු බැලීම"
      subtitle="සිසුන් දීපු පිළිතුරු හා ප්‍රතිඵල විස්තරාත්මකව බලන්න"
    >
    </app-page-header>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <!-- Filter Section -->
    <mat-card class="filter-card" *ngIf="!selectedAttempt">
      <div class="filter-row">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>වර්ෂය අනුව පෙරන්න</mat-label>
          <mat-select
            [(value)]="selectedYear"
            (selectionChange)="onYearChange()"
          >
            <mat-option [value]="null">සියල්ල</mat-option>
            <mat-option *ngFor="let y of years" [value]="y">{{ y }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field
          appearance="outline"
          class="filter-field"
          *ngIf="selectedYear && papers.length > 0"
        >
          <mat-label>පත්‍රය අනුව පෙරන්න</mat-label>
          <mat-select
            [(value)]="selectedPaperId"
            (selectionChange)="onPaperChange()"
          >
            <mat-option [value]="null">සියල්ල</mat-option>
            <mat-option *ngFor="let p of papers" [value]="p.id">
              {{ p.subjectName }} ({{ p.year }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <button
          mat-stroked-button
          color="primary"
          (click)="clearFilters()"
          *ngIf="selectedYear || selectedPaperId"
        >
          <mat-icon>clear</mat-icon> පෙරහන ඉවත් කරන්න
        </button>
      </div>
    </mat-card>

    <!-- Back button when viewing detail -->
    <div class="back-bar" *ngIf="selectedAttempt">
      <button mat-stroked-button (click)="closeDetail()">
        <mat-icon>arrow_back</mat-icon> ආපසු යන්න
      </button>
    </div>

    <!-- Attempts List -->
    <div class="attempts-list" *ngIf="!loading && !selectedAttempt">
      <mat-card
        class="attempt-card"
        *ngFor="let a of attempts"
        (click)="viewDetail(a.attemptId)"
      >
        <div class="attempt-card__main">
          <div class="attempt-avatar">{{ getInitials(a.studentName) }}</div>
          <div class="attempt-info">
            <h4>{{ a.studentName }}</h4>
            <span class="attempt-email">{{ a.studentEmail }}</span>
            <div class="attempt-meta">
              <span class="meta-chip subject">{{ a.subjectName }}</span>
              <span class="meta-chip year">{{ a.year }}</span>
              <span class="meta-chip attempt-no"
                >{{ a.attemptNo }} වන උත්සාහය</span
              >
            </div>
          </div>
          <div class="attempt-score">
            <div
              class="score-circle"
              [class.good]="a.score >= 30"
              [class.great]="a.score >= 35"
              [class.low]="a.score < 20"
            >
              {{ a.score }}/{{ a.totalQuestions }}
            </div>
            <span class="score-label">ලකුණු</span>
          </div>
          <div class="attempt-stats">
            <div class="stat correct">
              <mat-icon>check_circle</mat-icon> {{ a.correctCount }}
            </div>
            <div class="stat wrong">
              <mat-icon>cancel</mat-icon> {{ a.wrongCount }}
            </div>
          </div>
          <div class="attempt-date">
            {{ a.submittedAt | date: 'yyyy-MM-dd HH:mm' }}
          </div>
          <mat-icon class="view-icon">chevron_right</mat-icon>
        </div>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && !selectedAttempt && attempts.length === 0"
      icon="quiz"
      title="පිළිතුරු නොමැත"
      message="තවම කිසිදු ශිෂ්‍යයෙකු විභාගයක් සම්පූර්ණ කර නැත."
    >
    </app-empty-state>

    <!-- Paginator -->
    <mat-paginator
      *ngIf="!selectedAttempt && attempts.length > 0"
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="currentPage"
      (page)="onPageChange($event)"
      [hidePageSize]="true"
    >
    </mat-paginator>

    <!-- Attempt Detail View -->
    <div class="detail-view" *ngIf="selectedAttempt">
      <mat-card class="detail-header-card">
        <div class="detail-header">
          <div class="detail-student">
            <div class="detail-avatar">
              {{ getInitials(selectedAttempt.studentName) }}
            </div>
            <div>
              <h3>{{ selectedAttempt.studentName }}</h3>
              <span class="detail-email">{{
                selectedAttempt.studentEmail
              }}</span>
            </div>
          </div>
          <div class="detail-paper">
            <span class="detail-subject">{{
              selectedAttempt.subjectName
            }}</span>
            <span class="detail-year">{{ selectedAttempt.year }}</span>
            <span class="detail-attempt"
              >{{ selectedAttempt.attemptNo }} වන උත්සාහය</span
            >
          </div>
          <div class="detail-scores">
            <div
              class="score-big"
              [class.good]="selectedAttempt.score >= 30"
              [class.great]="selectedAttempt.score >= 35"
              [class.low]="selectedAttempt.score < 20"
            >
              {{ selectedAttempt.score }}/{{ selectedAttempt.totalQuestions }}
            </div>
            <div class="score-breakdown">
              <span class="correct-label"
                ><mat-icon>check_circle</mat-icon> නිවැරදි:
                {{ selectedAttempt.correctCount }}</span
              >
              <span class="wrong-label"
                ><mat-icon>cancel</mat-icon> වැරදි:
                {{ selectedAttempt.wrongCount }}</span
              >
              <span
                class="unanswered-label"
                *ngIf="selectedAttempt.unansweredCount > 0"
                ><mat-icon>help_outline</mat-icon> පිළිතුරු නොදුන්:
                {{ selectedAttempt.unansweredCount }}</span
              >
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Questions & Answers -->
      <div class="questions-list">
        <mat-card
          class="question-card"
          *ngFor="let ans of selectedAttempt.answers; let i = index"
          [class.correct]="ans.isCorrect"
          [class.wrong]="!ans.isCorrect && !ans.isUnanswered"
          [class.unanswered]="ans.isUnanswered"
          [class.timeout]="ans.isTimeout"
        >
          <div class="question-header">
            <span class="question-number"
              >ප්‍රශ්නය {{ ans.questionNumber }}</span
            >
            <span class="question-status" *ngIf="ans.isCorrect">
              <mat-icon>check_circle</mat-icon> නිවැරදි
            </span>
            <span
              class="question-status wrong"
              *ngIf="!ans.isCorrect && !ans.isUnanswered && !ans.isTimeout"
            >
              <mat-icon>cancel</mat-icon> වැරදි
            </span>
            <span class="question-status timeout" *ngIf="ans.isTimeout">
              <mat-icon>timer_off</mat-icon> කාලය ඉකුත් විය
            </span>
            <span class="question-status unanswered" *ngIf="ans.isUnanswered">
              <mat-icon>help_outline</mat-icon> පිළිතුරු නොදුන්
            </span>
            <span class="time-taken" *ngIf="ans.timeTakenSeconds != null">
              {{ ans.timeTakenSeconds }}s
            </span>
          </div>

          <p class="question-text">{{ ans.questionText }}</p>

          <div class="options-list">
            <div
              class="option-item"
              *ngFor="let opt of ans.options"
              [class.correct-option]="opt.isCorrect"
              [class.selected-option]="opt.isSelected"
              [class.wrong-selected]="opt.isSelected && !opt.isCorrect"
            >
              <span class="option-letter">{{
                getOptionLetter(opt.optionOrder)
              }}</span>
              <span class="option-text">{{ opt.optionText }}</span>
              <mat-icon class="option-icon" *ngIf="opt.isCorrect"
                >check_circle</mat-icon
              >
              <mat-icon
                class="option-icon wrong-icon"
                *ngIf="opt.isSelected && !opt.isCorrect"
                >cancel</mat-icon
              >
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .filter-card {
        margin-bottom: 16px;
        padding: 16px 20px !important;
      }
      .filter-row {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .filter-field {
        min-width: 200px;
      }
      .back-bar {
        margin-bottom: 16px;
      }

      /* Attempts List */
      .attempts-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .attempt-card {
        padding: 16px 20px !important;
        cursor: pointer;
        transition: box-shadow 0.2s;
      }
      .attempt-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }
      .attempt-card__main {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .attempt-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0b3d91;
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        flex-shrink: 0;
      }
      .attempt-info {
        flex: 1;
        min-width: 180px;
      }
      .attempt-info h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }
      .attempt-email {
        font-size: 12px;
        color: #666;
      }
      .attempt-meta {
        display: flex;
        gap: 6px;
        margin-top: 6px;
        flex-wrap: wrap;
      }
      .meta-chip {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
      }
      .meta-chip.subject {
        background: #e3f2fd;
        color: #1565c0;
      }
      .meta-chip.year {
        background: #f3e5f5;
        color: #7b1fa2;
      }
      .meta-chip.attempt-no {
        background: #fff3e0;
        color: #e65100;
      }
      .attempt-score {
        text-align: center;
        flex-shrink: 0;
      }
      .score-circle {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        background: #fce4ec;
        color: #c62828;
      }
      .score-circle.good {
        background: #e8f5e9;
        color: #2e7d32;
      }
      .score-circle.great {
        background: #c8e6c9;
        color: #1b5e20;
      }
      .score-circle.low {
        background: #ffebee;
        color: #b71c1c;
      }
      .score-label {
        font-size: 10px;
        color: #999;
      }
      .attempt-stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex-shrink: 0;
      }
      .stat {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 600;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
      .stat.correct {
        color: #2e7d32;
      }
      .stat.wrong {
        color: #c62828;
      }
      .attempt-date {
        font-size: 11px;
        color: #999;
        flex-shrink: 0;
      }
      .view-icon {
        color: #bbb;
        flex-shrink: 0;
      }

      /* Detail View */
      .detail-header-card {
        margin-bottom: 20px;
        padding: 20px 24px !important;
      }
      .detail-header {
        display: flex;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
      }
      .detail-student {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 200px;
      }
      .detail-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0b3d91;
        color: #fff;
        font-weight: 700;
        font-size: 16px;
      }
      .detail-student h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .detail-email {
        font-size: 13px;
        color: #666;
      }
      .detail-paper {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
      .detail-subject,
      .detail-year,
      .detail-attempt {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
      }
      .detail-subject {
        background: #e3f2fd;
        color: #1565c0;
      }
      .detail-year {
        background: #f3e5f5;
        color: #7b1fa2;
      }
      .detail-attempt {
        background: #fff3e0;
        color: #e65100;
      }
      .detail-scores {
        text-align: center;
      }
      .score-big {
        font-size: 28px;
        font-weight: 800;
        color: #c62828;
      }
      .score-big.good {
        color: #2e7d32;
      }
      .score-big.great {
        color: #1b5e20;
      }
      .score-big.low {
        color: #b71c1c;
      }
      .score-breakdown {
        display: flex;
        gap: 12px;
        font-size: 13px;
        margin-top: 4px;
        flex-wrap: wrap;
      }
      .correct-label {
        color: #2e7d32;
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .wrong-label {
        color: #c62828;
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .unanswered-label {
        color: #f57c00;
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .score-breakdown mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      /* Questions List */
      .questions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .question-card {
        padding: 16px 20px !important;
        border-left: 4px solid #e0e0e0;
      }
      .question-card.correct {
        border-left-color: #4caf50;
      }
      .question-card.wrong {
        border-left-color: #f44336;
      }
      .question-card.unanswered {
        border-left-color: #ff9800;
      }
      .question-card.timeout {
        border-left-color: #9e9e9e;
      }
      .question-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }
      .question-number {
        font-weight: 700;
        font-size: 14px;
        color: #333;
      }
      .question-status {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #4caf50;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
      .question-status.wrong {
        color: #f44336;
      }
      .question-status.timeout {
        color: #9e9e9e;
      }
      .question-status.unanswered {
        color: #ff9800;
      }
      .time-taken {
        font-size: 11px;
        color: #999;
        margin-left: auto;
      }
      .question-text {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        margin: 8px 0 12px;
      }

      /* Options */
      .options-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .option-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        background: #fafafa;
        border: 1px solid #eee;
        font-size: 13px;
      }
      .option-item.correct-option {
        background: #e8f5e9;
        border-color: #a5d6a7;
      }
      .option-item.selected-option {
        border-width: 2px;
        font-weight: 600;
      }
      .option-item.wrong-selected {
        background: #ffebee;
        border-color: #ef9a9a;
      }
      .option-letter {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
        background: #e0e0e0;
        color: #333;
        flex-shrink: 0;
      }
      .correct-option .option-letter {
        background: #4caf50;
        color: #fff;
      }
      .wrong-selected .option-letter {
        background: #f44336;
        color: #fff;
      }
      .option-text {
        flex: 1;
      }
      .option-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #4caf50;
      }
      .option-icon.wrong-icon {
        color: #f44336;
      }
    `,
  ],
})
export class StudentAnswersComponent implements OnInit {
  loading = false;
  attempts: StudentAttemptSummaryDto[] = [];
  selectedAttempt: AttemptDetailDto | null = null;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;

  // Filters
  years: number[] = [];
  papers: PaperDto[] = [];
  selectedYear: number | null = null;
  selectedPaperId: string | null = null;
  private isTeacher = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService,
  ) {
    this.isTeacher = this.auth.hasRole('TEACHER');
  }

  ngOnInit(): void {
    this.loadYears();
    this.loadAttempts();
  }

  loadYears(): void {
    this.api.getYears().subscribe({
      next: (years) => (this.years = years),
    });
  }

  loadAttempts(): void {
    this.loading = true;
    let obs;
    if (this.selectedPaperId) {
      obs = this.isTeacher
        ? this.api.getTeacherStudentAttemptsByPaper(
            this.selectedPaperId,
            this.currentPage,
            this.pageSize,
          )
        : this.api.getStudentAttemptsByPaper(
            this.selectedPaperId,
            this.currentPage,
            this.pageSize,
          );
    } else {
      obs = this.isTeacher
        ? this.api.getTeacherStudentAttempts(this.currentPage, this.pageSize)
        : this.api.getStudentAttempts(this.currentPage, this.pageSize);
    }

    obs.subscribe({
      next: (res) => {
        this.attempts = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('පිළිතුරු ලබාගැනීම අසාර්ථකයි.');
      },
    });
  }

  onYearChange(): void {
    this.selectedPaperId = null;
    if (this.selectedYear) {
      this.api.getPapersByYear(this.selectedYear).subscribe({
        next: (papers) => (this.papers = papers),
      });
    } else {
      this.papers = [];
    }
    this.currentPage = 0;
    this.loadAttempts();
  }

  onPaperChange(): void {
    this.currentPage = 0;
    this.loadAttempts();
  }

  clearFilters(): void {
    this.selectedYear = null;
    this.selectedPaperId = null;
    this.papers = [];
    this.currentPage = 0;
    this.loadAttempts();
  }

  viewDetail(attemptId: string): void {
    this.loading = true;
    const obs = this.isTeacher
      ? this.api.getTeacherAttemptDetail(attemptId)
      : this.api.getAttemptDetail(attemptId);
    obs.subscribe({
      next: (detail) => {
        this.selectedAttempt = detail;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('විස්තර ලබාගැනීම අසාර්ථකයි.');
      },
    });
  }

  closeDetail(): void {
    this.selectedAttempt = null;
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadAttempts();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getOptionLetter(order: number): string {
    return String.fromCharCode(64 + order); // 1=A, 2=B, 3=C, 4=D
  }
}
