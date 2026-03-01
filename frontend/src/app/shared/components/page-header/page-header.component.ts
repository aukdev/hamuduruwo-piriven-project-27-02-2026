import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title">{{ title }}</h1>
        <p class="page-header__subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="page-header__actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }
      .page-header__title {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a2e;
        margin: 0;
        line-height: 1.3;
      }
      .page-header__subtitle {
        font-size: 14px;
        color: #555770;
        margin-top: 4px;
      }
      .page-header__actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      @media (max-width: 600px) {
        .page-header {
          flex-direction: column;
        }
        .page-header__title {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
