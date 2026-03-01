import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-timer-display',
  template: `
    <div
      class="timer"
      [class.warning]="remainingSeconds <= warningThreshold"
      [class.danger]="remainingSeconds <= dangerThreshold"
    >
      <mat-icon class="timer__icon">timer</mat-icon>
      <span class="timer__value">{{ displayTime }}</span>
      <span class="timer__label" *ngIf="label">{{ label }}</span>
    </div>
  `,
  styles: [
    `
      .timer {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 24px;
        background: #e8eaf6;
        color: #283593;
        font-weight: 700;
        font-size: 16px;
        transition: all 0.3s ease;
      }
      .timer__icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      .timer__label {
        font-size: 11px;
        font-weight: 500;
        opacity: 0.8;
      }
      .timer.warning {
        background: #fff3e0;
        color: #e65100;
      }
      .timer.danger {
        background: #fce4ec;
        color: #c62828;
        animation: pulse 1s ease-in-out infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `,
  ],
})
export class TimerDisplayComponent implements OnChanges, OnDestroy {
  @Input() remainingSeconds = 0;
  @Input() label = '';
  @Input() warningThreshold = 60;
  @Input() dangerThreshold = 10;
  @Input() autoCountdown = false;
  @Output() expired = new EventEmitter<void>();
  @Output() tick = new EventEmitter<number>();

  private sub?: Subscription;

  get displayTime(): string {
    const m = Math.floor(this.remainingSeconds / 60);
    const s = this.remainingSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['remainingSeconds'] || changes['autoCountdown']) {
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private startCountdown(): void {
    this.sub?.unsubscribe();
    if (!this.autoCountdown || this.remainingSeconds <= 0) return;

    this.sub = interval(1000)
      .pipe(takeWhile(() => this.remainingSeconds > 0))
      .subscribe(() => {
        this.remainingSeconds--;
        this.tick.emit(this.remainingSeconds);
        if (this.remainingSeconds <= 0) {
          this.expired.emit();
        }
      });
  }
}
