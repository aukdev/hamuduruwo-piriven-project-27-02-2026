import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <!-- Card List Skeleton -->
    <ng-container *ngIf="type === 'card-list'">
      <div class="sk-card-list">
        <div class="sk-card" *ngFor="let i of items">
          <div class="sk-card__header">
            <div class="skeleton skeleton--avatar"></div>
            <div class="sk-card__text">
              <div class="skeleton skeleton--text" style="width: 60%"></div>
              <div
                class="skeleton skeleton--text"
                style="width: 40%; height: 12px; margin-top: 6px"
              ></div>
            </div>
          </div>
          <div
            class="skeleton skeleton--text"
            style="width: 90%; margin-top: 12px"
          ></div>
          <div
            class="skeleton skeleton--text"
            style="width: 70%; margin-top: 8px"
          ></div>
        </div>
      </div>
    </ng-container>

    <!-- Grid Cards Skeleton -->
    <ng-container *ngIf="type === 'card-grid'">
      <div
        class="sk-grid"
        [style.grid-template-columns]="
          'repeat(auto-fill, minmax(' + gridMinWidth + ', 1fr))'
        "
      >
        <div class="sk-grid-card" *ngFor="let i of items">
          <div
            class="skeleton"
            style="height: 20px; width: 40%; margin-bottom: 12px"
          ></div>
          <div class="skeleton skeleton--text" style="width: 80%"></div>
          <div
            class="skeleton skeleton--text"
            style="width: 60%; margin-top: 8px"
          ></div>
          <div class="sk-grid-card__footer">
            <div class="skeleton" style="height: 10px; width: 45%"></div>
            <div class="skeleton" style="height: 10px; width: 30%"></div>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- Stats Row Skeleton -->
    <ng-container *ngIf="type === 'stats'">
      <div class="sk-stats">
        <div class="sk-stat-card" *ngFor="let i of items">
          <div
            class="skeleton"
            style="width: 48px; height: 48px; border-radius: 12px"
          ></div>
          <div>
            <div
              class="skeleton"
              style="height: 28px; width: 60px; margin-bottom: 6px"
            ></div>
            <div class="skeleton" style="height: 12px; width: 80px"></div>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- Table Skeleton -->
    <ng-container *ngIf="type === 'table'">
      <div class="sk-table">
        <div class="sk-table-row header">
          <div class="skeleton" style="height: 14px; width: 20%"></div>
          <div class="skeleton" style="height: 14px; width: 25%"></div>
          <div class="skeleton" style="height: 14px; width: 20%"></div>
          <div class="skeleton" style="height: 14px; width: 15%"></div>
        </div>
        <div class="sk-table-row" *ngFor="let i of items">
          <div class="skeleton" style="height: 14px; width: 30%"></div>
          <div class="skeleton" style="height: 14px; width: 40%"></div>
          <div class="skeleton" style="height: 14px; width: 25%"></div>
          <div class="skeleton" style="height: 14px; width: 20%"></div>
        </div>
      </div>
    </ng-container>

    <!-- User List Skeleton -->
    <ng-container *ngIf="type === 'user-list'">
      <div class="sk-card-list">
        <div class="sk-user-card" *ngFor="let i of items">
          <div class="skeleton skeleton--avatar"></div>
          <div class="sk-user-info">
            <div class="skeleton skeleton--text" style="width: 45%"></div>
            <div
              class="skeleton skeleton--text"
              style="width: 55%; height: 12px; margin-top: 6px"
            ></div>
            <div class="sk-user-badges">
              <div
                class="skeleton"
                style="height: 18px; width: 60px; border-radius: 4px"
              ></div>
              <div
                class="skeleton"
                style="height: 18px; width: 50px; border-radius: 4px"
              ></div>
            </div>
          </div>
          <div class="sk-user-actions">
            <div
              class="skeleton"
              style="width: 32px; height: 32px; border-radius: 50%"
            ></div>
            <div
              class="skeleton"
              style="width: 32px; height: 32px; border-radius: 50%"
            ></div>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- Question List Skeleton -->
    <ng-container *ngIf="type === 'question-list'">
      <div class="sk-card-list">
        <div class="sk-question-card" *ngFor="let i of items">
          <div class="sk-question-header">
            <div
              class="skeleton"
              style="height: 20px; width: 80px; border-radius: 4px"
            ></div>
            <div
              class="skeleton"
              style="height: 20px; width: 100px; border-radius: 4px"
            ></div>
            <div
              class="skeleton"
              style="height: 20px; width: 60px; border-radius: 4px"
            ></div>
          </div>
          <div
            class="skeleton skeleton--text"
            style="width: 90%; margin-top: 12px"
          ></div>
          <div
            class="skeleton skeleton--text"
            style="width: 75%; margin-top: 8px"
          ></div>
          <div class="sk-options">
            <div class="sk-option" *ngFor="let j of [1, 2, 3, 4]">
              <div
                class="skeleton"
                style="width: 28px; height: 28px; border-radius: 50%"
              ></div>
              <div class="skeleton skeleton--text" style="width: 70%"></div>
            </div>
          </div>
          <div class="sk-question-actions">
            <div class="skeleton skeleton--button"></div>
            <div class="skeleton skeleton--button" style="width: 120px"></div>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- Dashboard Skeleton -->
    <ng-container *ngIf="type === 'dashboard'">
      <div class="sk-dash-header">
        <div>
          <div class="skeleton skeleton--title"></div>
          <div
            class="skeleton skeleton--text"
            style="width: 40%; margin-top: 8px"
          ></div>
        </div>
      </div>
      <div class="sk-stats" style="margin-top: 16px">
        <div class="sk-stat-card" *ngFor="let i of [1, 2, 3]">
          <div
            class="skeleton"
            style="width: 48px; height: 48px; border-radius: 12px"
          ></div>
          <div>
            <div
              class="skeleton"
              style="height: 28px; width: 60px; margin-bottom: 6px"
            ></div>
            <div class="skeleton" style="height: 12px; width: 80px"></div>
          </div>
        </div>
      </div>
      <div
        class="sk-grid"
        style="margin-top: 24px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))"
      >
        <div class="sk-grid-card" *ngFor="let i of [1, 2, 3, 4]">
          <div
            class="skeleton"
            style="height: 32px; width: 32px; border-radius: 8px; margin-bottom: 12px"
          ></div>
          <div class="skeleton skeleton--text" style="width: 60%"></div>
          <div
            class="skeleton skeleton--text"
            style="width: 85%; margin-top: 8px"
          ></div>
        </div>
      </div>
    </ng-container>

    <!-- Result Skeleton -->
    <ng-container *ngIf="type === 'result'">
      <div class="sk-result">
        <div class="sk-result-hero">
          <div class="skeleton skeleton--circle-lg"></div>
          <div
            class="skeleton skeleton--text"
            style="width: 50%; margin-top: 16px"
          ></div>
        </div>
        <div class="sk-result-stats">
          <div class="sk-result-stat" *ngFor="let i of [1, 2, 3]">
            <div
              class="skeleton"
              style="width: 28px; height: 28px; border-radius: 50%; margin-bottom: 8px"
            ></div>
            <div
              class="skeleton"
              style="height: 28px; width: 40px; margin-bottom: 4px"
            ></div>
            <div class="skeleton" style="height: 12px; width: 60px"></div>
          </div>
        </div>
        <div class="sk-grid-card" style="margin-top: 16px">
          <div
            class="skeleton skeleton--text"
            style="width: 70%; margin-bottom: 12px"
          ></div>
          <div
            class="skeleton skeleton--text"
            style="width: 50%; margin-bottom: 12px"
          ></div>
          <div class="skeleton skeleton--text" style="width: 60%"></div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .sk-card-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .sk-card,
      .sk-user-card,
      .sk-question-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e3eb;
        padding: 20px 24px;
      }
      .sk-card__header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .sk-card__text {
        flex: 1;
      }
      .sk-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }
      .sk-grid-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e3eb;
        padding: 24px;
      }
      .sk-grid-card__footer {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
      }
      .sk-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .sk-stat-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e3eb;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .sk-table {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e3eb;
        overflow: hidden;
      }
      .sk-table-row {
        display: flex;
        gap: 16px;
        padding: 14px 20px;
        border-bottom: 1px solid #f0f0f5;
        &.header {
          background: #f8f9fb;
        }
      }
      .sk-user-card {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .sk-user-info {
        flex: 1;
        min-width: 0;
      }
      .sk-user-badges {
        display: flex;
        gap: 6px;
        margin-top: 8px;
      }
      .sk-user-actions {
        display: flex;
        gap: 6px;
      }
      .sk-question-header {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .sk-options {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .sk-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #e8eaf0;
      }
      .sk-question-actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f5;
      }
      .sk-dash-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .sk-result {
        max-width: 600px;
        margin: 0 auto;
      }
      .sk-result-hero {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e3eb;
        padding: 40px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;
      }
      .sk-result-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }
      .sk-result-stat {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e0e3eb;
        padding: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export class SkeletonComponent {
  @Input() type:
    | 'card-list'
    | 'card-grid'
    | 'stats'
    | 'table'
    | 'user-list'
    | 'question-list'
    | 'dashboard'
    | 'result' = 'card-list';
  @Input() count = 3;
  @Input() gridMinWidth = '280px';

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
