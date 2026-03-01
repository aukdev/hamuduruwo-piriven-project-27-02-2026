import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="loading-overlay" *ngIf="show">
      <mat-spinner [diameter]="40"></mat-spinner>
      <span class="loading-text" *ngIf="text">{{ text }}</span>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        gap: 16px;
      }
      .loading-text {
        font-size: 14px;
        color: #555770;
      }
    `,
  ],
})
export class LoadingOverlayComponent {
  @Input() show = false;
  @Input() text = 'පූරණය වෙමින්...';
}
