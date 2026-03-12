import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-years',
  template: `
    <app-page-header
      title="වර්ෂය තෝරන්න"
      subtitle="අතීත ප්‍රශ්න පත්‍ර වර්ෂ / Select Year"
    ></app-page-header>

    <app-skeleton
      *ngIf="loading"
      type="card-grid"
      [count]="8"
      gridMinWidth="160px"
    ></app-skeleton>

    <div class="years-grid" *ngIf="!loading">
      <mat-card
        class="year-card"
        *ngFor="let year of years"
        (click)="selectYear(year)"
      >
        <div class="year-card__number">{{ year }}</div>
        <div class="year-card__label">වර්ෂය</div>
        <mat-icon class="year-card__icon">calendar_today</mat-icon>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && years.length === 0"
      icon="event_busy"
      title="වර්ෂ නොමැත"
      message="ලබා ගත හැකි ප්‍රශ්න පත්‍ර වර්ෂ නොමැත."
    >
    </app-empty-state>
  `,
  styles: [
    `
      .years-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }
      .year-card {
        text-align: center;
        padding: 32px 20px !important;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s;

        &:hover {
          transform: translateY(-4px);
          border-color: var(--color-primary);
        }
      }
      .year-card__number {
        font-size: 32px;
        font-weight: 800;
        color: var(--color-primary);
      }
      .year-card__label {
        font-size: 12px;
        color: var(--color-text-secondary);
        margin-top: 4px;
      }
      .year-card__icon {
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 20px;
        color: var(--color-accent);
        opacity: 0.6;
      }
    `,
  ],
})
export class YearsComponent implements OnInit {
  years: number[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getYears().subscribe({
      next: (years) => {
        this.years = years.sort((a, b) => b - a);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  selectYear(year: number): void {
    this.router.navigate(['/student/years', year, 'papers']);
  }
}
