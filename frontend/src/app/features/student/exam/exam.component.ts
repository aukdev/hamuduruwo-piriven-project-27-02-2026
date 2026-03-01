import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NextQuestionResponse, QuestionOptionDto } from '../../../core/models';

@Component({
  selector: 'app-exam',
  template: `
    <div class="exam-container" *ngIf="!examLoading && currentQuestion">
      <!-- Top Bar -->
      <div class="exam-top-bar">
        <div class="exam-top-bar__left">
          <span class="exam-badge"
            >ප්‍රශ්නය {{ currentQuestion.questionNumber }}/40</span
          >
        </div>
        <div class="exam-top-bar__timers">
          <app-timer-display
            [remainingSeconds]="totalRemainingSeconds"
            [autoCountdown]="true"
            [warningThreshold]="120"
            [dangerThreshold]="30"
            label="මුළු කාලය"
            (expired)="onTotalTimeExpired()"
          >
          </app-timer-display>
          <app-timer-display
            [remainingSeconds]="questionRemainingSeconds"
            [autoCountdown]="true"
            [warningThreshold]="10"
            [dangerThreshold]="5"
            label="ප්‍රශ්න කාලය"
            (expired)="onQuestionTimeExpired()"
          >
          </app-timer-display>
        </div>
      </div>

      <!-- Question -->
      <mat-card class="exam-question-card">
        <div class="question-number-badge">
          {{ currentQuestion.questionNumber }}
        </div>
        <h2 class="question-text">{{ currentQuestion.questionText }}</h2>
      </mat-card>

      <!-- Options -->
      <div class="exam-options">
        <div
          *ngFor="let opt of currentQuestion.options; let i = index"
          class="option-card"
          [class.selected]="selectedOptionId === opt.id"
          (click)="selectOption(opt)"
        >
          <div class="option-label">{{ optionLabels[i] }}</div>
          <div class="option-text">{{ opt.optionText }}</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="exam-actions">
        <button
          mat-flat-button
          color="primary"
          [disabled]="!selectedOptionId || submitting"
          (click)="submitAnswer()"
          class="exam-next-btn"
        >
          <mat-spinner *ngIf="submitting" diameter="20"></mat-spinner>
          <span *ngIf="!submitting">
            {{
              currentQuestion.questionNumber === 40
                ? 'විභාගය ඉදිරිපත් කරන්න'
                : 'ඊළඟ ප්‍රශ්නය'
            }}
            <mat-icon>{{
              currentQuestion.questionNumber === 40
                ? 'done_all'
                : 'arrow_forward'
            }}</mat-icon>
          </span>
        </button>
      </div>

      <!-- Progress -->
      <mat-progress-bar
        mode="determinate"
        [value]="((currentQuestion.questionNumber || 0) / 40) * 100"
        class="exam-progress"
      >
      </mat-progress-bar>
    </div>

    <!-- Loading -->
    <app-loading-overlay
      [show]="examLoading"
      text="ප්‍රශ්නය පූරණය වෙමින්..."
    ></app-loading-overlay>

    <!-- All Questions Answered -->
    <div class="exam-completed" *ngIf="allAnswered && !examLoading">
      <mat-card class="text-center" style="padding: 48px;">
        <mat-icon
          style="font-size:64px; width:64px; height:64px; color:#2e7d32;"
          >check_circle</mat-icon
        >
        <h2 class="mt-16">සියලු ප්‍රශ්න පිළිතුරු දී ඇත!</h2>
        <p class="text-muted mt-8">විභාගය ඉදිරිපත් කරමින්...</p>
        <mat-spinner
          diameter="32"
          class="mt-16"
          style="margin: 16px auto;"
        ></mat-spinner>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .exam-container {
        max-width: 800px;
        margin: 0 auto;
      }
      .exam-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .exam-badge {
        background: #0b3d91;
        color: #fff;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 700;
      }
      .exam-top-bar__timers {
        display: flex;
        gap: 12px;
      }
      .exam-question-card {
        padding: 32px !important;
        position: relative;
        margin-bottom: 24px;
        border-left: 4px solid #0b3d91 !important;
      }
      .question-number-badge {
        position: absolute;
        top: -12px;
        left: 20px;
        background: #f4b400;
        color: #1a1a2e;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 14px;
      }
      .question-text {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.8;
        color: #1a1a2e;
      }
      .exam-options {
        margin-bottom: 24px;
      }
      .exam-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 24px;
      }
      .exam-next-btn {
        height: 48px !important;
        padding: 0 32px !important;
        font-size: 16px;

        mat-icon {
          margin-left: 8px;
        }
      }
      .exam-progress {
        border-radius: 4px;
      }
      .exam-completed {
        max-width: 500px;
        margin: 48px auto;
      }

      @media (max-width: 600px) {
        .exam-top-bar {
          flex-direction: column;
          align-items: stretch;
        }
        .exam-top-bar__timers {
          justify-content: center;
        }
        .exam-question-card {
          padding: 24px 16px !important;
        }
        .question-text {
          font-size: 16px;
        }
      }
    `,
  ],
})
export class ExamComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  attemptId = '';
  currentQuestion: NextQuestionResponse | null = null;
  selectedOptionId: string | null = null;
  totalRemainingSeconds = 0;
  questionRemainingSeconds = 0;
  examLoading = true;
  submitting = false;
  allAnswered = false;
  optionLabels = ['A', 'B', 'C', 'D'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.attemptId = this.route.snapshot.params['attemptId'];
    this.loadNextQuestion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNextQuestion(): void {
    this.examLoading = true;
    this.selectedOptionId = null;

    this.api.getNextQuestion(this.attemptId).subscribe({
      next: (res) => {
        if (res.attemptExpired) {
          this.notify.info('විභාග කාලය අවසන්!');
          this.router.navigate(['/student/result', this.attemptId]);
          return;
        }

        if (res.allQuestionsAnswered) {
          this.allAnswered = true;
          this.examLoading = false;
          this.submitExam();
          return;
        }

        this.currentQuestion = res;
        this.totalRemainingSeconds = res.remainingSecondsTotal || 0;
        this.questionRemainingSeconds = res.remainingSecondsForQuestion || 30;
        this.examLoading = false;
      },
      error: (err) => {
        this.examLoading = false;
        this.notify.error(err.error?.message || 'ප්‍රශ්නය පූරණය කළ නොහැක.');
      },
    });
  }

  selectOption(opt: QuestionOptionDto): void {
    if (!this.submitting) {
      this.selectedOptionId = opt.id;
    }
  }

  submitAnswer(): void {
    if (!this.selectedOptionId || !this.currentQuestion?.questionId) return;

    this.submitting = true;
    this.api
      .submitAnswer(this.attemptId, {
        questionId: this.currentQuestion.questionId,
        selectedOptionId: this.selectedOptionId,
      })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          if (res.attemptExpired) {
            this.notify.info('විභාග කාලය අවසන්!');
            this.router.navigate(['/student/result', this.attemptId]);
            return;
          }
          this.loadNextQuestion();
        },
        error: (err) => {
          this.submitting = false;
          if (err.status === 409 || err.status === 400) {
            // Already answered or expired, just load next
            this.loadNextQuestion();
          } else {
            this.notify.error(
              err.error?.message || 'පිළිතුර ඉදිරිපත් කළ නොහැක.',
            );
          }
        },
      });
  }

  onQuestionTimeExpired(): void {
    // Auto-advance: submit empty and load next
    if (!this.submitting) {
      if (this.selectedOptionId) {
        this.submitAnswer();
      } else {
        this.loadNextQuestion();
      }
    }
  }

  onTotalTimeExpired(): void {
    this.notify.info('විභාග කාලය අවසන්!');
    this.router.navigate(['/student/result', this.attemptId]);
  }

  private submitExam(): void {
    this.api.submitAttempt(this.attemptId).subscribe({
      next: () => {
        this.router.navigate(['/student/result', this.attemptId]);
      },
      error: () => {
        this.router.navigate(['/student/result', this.attemptId]);
      },
    });
  }
}
