import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { TimerDisplayComponent } from '../../../shared/components/timer-display/timer-display.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NextQuestionResponse, QuestionOptionDto } from '../../../core/models';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [...SHARED_IMPORTS, LoadingOverlayComponent, TimerDisplayComponent],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
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
  totalQuestions = 40;
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
        this.totalQuestions = res.totalQuestions || this.totalQuestions;
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
