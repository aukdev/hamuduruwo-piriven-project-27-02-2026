import { Component } from '@angular/core';

@Component({
  selector: 'app-superadmin-dashboard',
  template: `
    <app-page-header
      title="ප්‍රධාන පරිපාලක උපකරණ පුවරුව"
      subtitle="සම්පූර්ණ පද්ධති පාලනය"
    >
    </app-page-header>

    <div class="cards-grid">
      <mat-card class="action-card" routerLink="/superadmin/questions">
        <div class="card-icon questions"><mat-icon>quiz</mat-icon></div>
        <h4>ප්‍රශ්න කළමනාකරණය</h4>
        <p>සියලුම ප්‍රශ්න සෑදීම, සංස්කරණය, මකා දැමීම</p>
        <mat-icon class="arrow">chevron_right</mat-icon>
      </mat-card>

      <mat-card class="action-card" routerLink="/superadmin/users">
        <div class="card-icon users">
          <mat-icon>admin_panel_settings</mat-icon>
        </div>
        <h4>පරිශීලක කළමනාකරණය</h4>
        <p>පරිශීලකයින් බැලීම, මකා දැමීම</p>
        <mat-icon class="arrow">chevron_right</mat-icon>
      </mat-card>

      <mat-card class="action-card" routerLink="/superadmin/papers">
        <div class="card-icon papers">
          <mat-icon>description</mat-icon>
        </div>
        <h4>පත්‍ර කළමනාකරණය</h4>
        <p>ප්‍රශ්න පත්‍ර සැදීම, ප්‍රශ්න එක් කිරීම</p>
        <mat-icon class="arrow">chevron_right</mat-icon>
      </mat-card>
    </div>

    <mat-card class="info-banner mt-24">
      <mat-icon>info</mat-icon>
      <div>
        <strong>ප්‍රධාන පරිපාලක ගිණුම</strong>
        <p>
          ඔබට පද්ධතියේ සියලුම අංශ වෙත ප්‍රවේශය ඇත. ප්‍රශ්න සෘජුවම සෑදීම,
          සංස්කරණය, මකා දැමීම මෙන්ම පරිශීලකයින් ස්ථිරවම මකා දැමීමට ද ඔබට හැකියාව
          ඇත. කරුණාකර මෙම බලතල ප්‍රවේශමෙන් භාවිත කරන්න.
        </p>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .action-card {
        padding: 28px !important;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        cursor: pointer;
        transition: all 0.15s;
        position: relative;

        &:hover {
          border-color: #0b3d91;
          transform: translateY(-2px);
        }
      }
      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          color: #fff;
          font-size: 26px;
          width: 26px;
          height: 26px;
        }
        &.questions {
          background: linear-gradient(135deg, #0b3d91, #1565c0);
        }
        &.users {
          background: linear-gradient(135deg, #f4b400, #ff8f00);
        }
        &.papers {
          background: linear-gradient(135deg, #2e7d32, #43a047);
        }
      }
      h4 {
        margin: 0 0 4px;
        font-size: 16px;
        font-weight: 600;
        color: #1a1a2e;
      }
      p {
        margin: 0;
        font-size: 13px;
        color: #666;
        line-height: 1.5;
      }
      .arrow {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #ccc;
      }
      .info-banner {
        padding: 20px 24px !important;
        display: flex;
        gap: 14px;
        align-items: flex-start;
        background: rgba(11, 61, 145, 0.03);
        border-left: 4px solid #0b3d91;

        > mat-icon {
          color: #0b3d91;
          margin-top: 2px;
        }
        strong {
          font-size: 14px;
          color: #0b3d91;
        }
        p {
          margin: 4px 0 0;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }
      }
    `,
  ],
})
export class SuperadminDashboardComponent {}
