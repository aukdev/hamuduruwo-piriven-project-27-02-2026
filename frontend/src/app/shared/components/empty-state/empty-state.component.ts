import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <mat-icon class="empty-state__icon">{{ icon }}</mat-icon>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__message" *ngIf="message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        text-align: center;
      }
      .empty-state__icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #c1c5d0;
        margin-bottom: 16px;
      }
      .empty-state__title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a2e;
        margin-bottom: 8px;
      }
      .empty-state__message {
        font-size: 14px;
        color: #555770;
        max-width: 400px;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'දත්ත නැත';
  @Input() message = '';
}
