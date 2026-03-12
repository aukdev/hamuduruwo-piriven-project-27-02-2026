import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  template: `
    <app-page-header
      title="මුල් පිටුව"
      [subtitle]="'ආයුබෝවන්, ' + (user?.fullName || '')"
    ></app-page-header>

    <div class="dashboard-grid">
      <!-- Quick Actions -->
      <mat-card
        class="action-card"
        (click)="router.navigate(['/student/years'])"
      >
        <div
          class="action-card__icon-wrap"
          style="background: rgba(11,61,145,0.1);"
        >
          <mat-icon style="color: #0B3D91;">quiz</mat-icon>
        </div>
        <div class="action-card__info">
          <h3>විභාගයක් අරඹන්න</h3>
          <p>අතීත ප්‍රශ්න පත්‍ර තෝරා පුහුණු වන්න</p>
        </div>
        <mat-icon class="action-card__arrow">chevron_right</mat-icon>
      </mat-card>

      <mat-card class="action-card highlight-card">
        <div
          class="action-card__icon-wrap"
          style="background: rgba(244,180,0,0.15);"
        >
          <mat-icon style="color: #F4B400;">emoji_events</mat-icon>
        </div>
        <div class="action-card__info">
          <h3>පුහුණුව ආරම්භ කරන්න</h3>
          <p>වර්ෂ 2017 සිට 2025 දක්වා ප්‍රශ්න පත්‍ර ලබා ගත හැක</p>
        </div>
        <mat-icon class="action-card__arrow">chevron_right</mat-icon>
      </mat-card>
    </div>

    <!-- Info Banner -->
    <mat-card class="info-banner mt-24">
      <mat-icon>info</mat-icon>
      <div>
        <p><strong>විභාග නීති:</strong></p>
        <ul>
          <li>එක් ප්‍රශ්න පත්‍රයකට උපරිම උත්සාහයන් 10ක්</li>
          <li>මුළු කාලය: මිනිත්තු 20 (තත්පර 1200)</li>
          <li>එක් ප්‍රශ්නයකට තත්පර 30</li>
          <li>ප්‍රශ්න 40ක් - A/B/C/D බහුවරණ</li>
        </ul>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 16px;
      }
      .action-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px !important;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          transform: translateY(-2px);
        }
      }
      .action-card__icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        border-radius: 14px;
        flex-shrink: 0;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }
      .action-card__info {
        flex: 1;
        h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }
        p {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
      }
      .action-card__arrow {
        color: #c1c5d0;
      }
      .highlight-card {
        border-left: 4px solid var(--color-accent) !important;
      }
      .info-banner {
        display: flex;
        gap: 16px;
        padding: 20px !important;
        background: rgba(11, 61, 145, 0.03) !important;
        border-left: 4px solid var(--color-primary) !important;

        > mat-icon {
          color: var(--color-primary);
          margin-top: 2px;
        }
        p {
          font-size: 14px;
          color: var(--color-text-primary);
          margin-bottom: 8px;
        }
        ul {
          padding-left: 20px;
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.8;
        }
      }
    `,
  ],
})
export class StudentDashboardComponent implements OnInit {
  user: CurrentUser | null = null;

  constructor(
    private auth: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;
  }
}
