import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { QuestionDto } from '../../../core/models';

@Component({
  selector: 'app-teacher-dashboard',
  template: `
    <app-page-header
      title="ගුරු මුල් පිටුව"
      [subtitle]="'ආයුබෝවන්, ' + auth.currentUser?.fullName"
    >
      <button
        mat-flat-button
        color="primary"
        routerLink="/teacher/questions/create"
      >
        <mat-icon>add</mat-icon> නව ප්‍රශ්නයක්
      </button>
    </app-page-header>

    <app-skeleton *ngIf="loading" type="dashboard"></app-skeleton>

    <div *ngIf="!loading">
      <div class="dashboard-grid">
        <mat-card class="stat-card" *ngFor="let stat of stats">
          <div class="stat-card__icon-wrap" [style.background]="stat.bg">
            <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">{{ stat.count }}</div>
            <div class="stat-card__label">{{ stat.label }}</div>
          </div>
        </mat-card>
      </div>

      <div class="mt-24">
        <h3 class="section-title">ඉක්මන් ක්‍රියා</h3>
        <div class="quick-actions">
          <mat-card
            class="action-card"
            (click)="router.navigate(['/teacher/questions/create'])"
          >
            <mat-icon>add_circle</mat-icon>
            <span>නව ප්‍රශ්නයක් සාදන්න</span>
          </mat-card>
          <mat-card
            class="action-card"
            (click)="router.navigate(['/teacher/questions'])"
          >
            <mat-icon>list_alt</mat-icon>
            <span>මගේ ප්‍රශ්න බලන්න</span>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px !important;
      }
      .stat-card__icon-wrap {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .stat-card__value {
        font-size: 28px;
        font-weight: 800;
        color: var(--color-text-primary);
      }
      .stat-card__label {
        font-size: 12px;
        color: var(--color-text-secondary);
      }
      .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
      }
      .action-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px !important;
        cursor: pointer;

        mat-icon {
          color: var(--color-primary);
        }
        span {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        &:hover {
          transform: translateY(-2px);
        }
      }
    `,
  ],
})
export class TeacherDashboardComponent implements OnInit {
  stats = [
    {
      icon: 'edit_note',
      label: 'කෙටුම්පත්',
      count: 0,
      bg: 'rgba(0,0,0,0.06)',
      color: '#424242',
    },
    {
      icon: 'pending',
      label: 'සමාලෝචනයට',
      count: 0,
      bg: 'rgba(244,180,0,0.15)',
      color: '#e65100',
    },
    {
      icon: 'check_circle',
      label: 'අනුමත',
      count: 0,
      bg: 'rgba(46,125,50,0.1)',
      color: '#2e7d32',
    },
    {
      icon: 'cancel',
      label: 'ප්‍රතික්ෂේප',
      count: 0,
      bg: 'rgba(198,40,40,0.1)',
      color: '#c62828',
    },
  ];

  loading = true;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getMyQuestions(0, 100).subscribe({
      next: (res) => {
        const questions = res.content;
        this.stats[0].count = questions.filter(
          (q) => q.status === 'DRAFT',
        ).length;
        this.stats[1].count = questions.filter(
          (q) => q.status === 'PENDING_REVIEW',
        ).length;
        this.stats[2].count = questions.filter(
          (q) => q.status === 'APPROVED',
        ).length;
        this.stats[3].count = questions.filter(
          (q) => q.status === 'REJECTED',
        ).length;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
