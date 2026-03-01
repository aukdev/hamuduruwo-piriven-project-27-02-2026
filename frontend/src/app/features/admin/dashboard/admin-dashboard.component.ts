import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <app-page-header
      title="පරිපාලක උපකරණ පුවරුව"
      subtitle="පද්ධති කළමනාකරණය"
    ></app-page-header>

    <div class="stats-grid">
      <mat-card class="stat-card pending" routerLink="/admin/approvals">
        <mat-icon>hourglass_empty</mat-icon>
        <div class="stat-info">
          <span class="stat-number">{{ pendingCount }}</span>
          <span class="stat-label">අනුමැතිය බලාපොරොත්තු</span>
        </div>
      </mat-card>

      <mat-card class="stat-card" routerLink="/admin/users">
        <mat-icon>people</mat-icon>
        <div class="stat-info">
          <span class="stat-number">{{ userCount }}</span>
          <span class="stat-label">පරිශීලකයින්</span>
        </div>
      </mat-card>

      <mat-card class="stat-card" routerLink="/admin/subjects">
        <mat-icon>menu_book</mat-icon>
        <div class="stat-info">
          <span class="stat-number">{{ subjectCount }}</span>
          <span class="stat-label">විෂයයන්</span>
        </div>
      </mat-card>
    </div>

    <h3 class="section-title mt-24">ඉක්මන් ක්‍රියා</h3>
    <div class="actions-grid">
      <mat-card class="action-card" routerLink="/admin/approvals">
        <mat-icon color="primary">fact_check</mat-icon>
        <h4>ප්‍රශ්න අනුමත කරන්න</h4>
        <p>ගුරුවරුන් ඉදිරිපත් කළ ප්‍රශ්න සමාලෝචනය කර අනුමත/ප්‍රතික්ෂේප කරන්න</p>
      </mat-card>
      <mat-card class="action-card" routerLink="/admin/users">
        <mat-icon color="primary">manage_accounts</mat-icon>
        <h4>පරිශීලක කළමනාකරණය</h4>
        <p>ගුරුවරුන් සත්‍යාපනය, පරිශීලකයින් අක්‍රිය කිරීම</p>
      </mat-card>
      <mat-card class="action-card" routerLink="/admin/subjects">
        <mat-icon color="primary">library_books</mat-icon>
        <h4>විෂය කළමනාකරණය</h4>
        <p>නව විෂයයන් එකතු කිරීම, ගුරුවරුන්ට විෂයයන් පැවරීම</p>
      </mat-card>
      <mat-card class="action-card" routerLink="/admin/papers">
        <mat-icon color="primary">assignment</mat-icon>
        <h4>පත්‍ර කළමනාකරණය</h4>
        <p>පත්‍රවලට ප්‍රශ්න පැවරීම</p>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
      }
      .stat-card {
        padding: 24px !important;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        &.pending {
          border-left: 4px solid #f4b400;
        }
        mat-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
          color: #0b3d91;
        }
      }
      .stat-info {
        display: flex;
        flex-direction: column;
      }
      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: #0b3d91;
        line-height: 1;
      }
      .stat-label {
        font-size: 13px;
        color: #666;
        margin-top: 4px;
      }

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 12px;
      }
      .action-card {
        padding: 24px !important;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          border-color: #0b3d91;
        }
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          margin-bottom: 8px;
        }
        h4 {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a2e;
        }
        p {
          margin: 0;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  pendingCount = 0;
  userCount = 0;
  subjectCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPendingQuestions(0, 1).subscribe({
      next: (r) => (this.pendingCount = r.totalElements),
      error: () => {},
    });
    this.api.getUsers(0, 1).subscribe({
      next: (r) => (this.userCount = r.totalElements),
      error: () => {},
    });
    this.api.getSubjects().subscribe({
      next: (s) => (this.subjectCount = s.length),
      error: () => {},
    });
  }
}
