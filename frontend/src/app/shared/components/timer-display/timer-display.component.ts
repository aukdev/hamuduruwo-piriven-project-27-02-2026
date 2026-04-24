import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './timer-display.component.html',
  styleUrls: ['./timer-display.component.scss'],
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
