import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing">
      <div class="landing__hero">
        <div class="landing__hero-content">
          <div class="landing__logo">
            <mat-icon class="landing__logo-icon">school</mat-icon>
          </div>
          <h1 class="landing__title">පිරිවෙන් MCQ</h1>
          <h2 class="landing__subtitle">අතීත ප්‍රශ්න පත්‍ර පද්ධතිය</h2>
          <p class="landing__desc">
            ශ්‍රී ලංකා රජයේ පිරිවෙන් පාසල් සඳහා නිර්මාණය කරන ලද බහුවරණ ප්‍රශ්න
            පුහුණු වේදිකාව. 2017 සිට 2025 දක්වා අතීත ප්‍රශ්න පත්‍ර සමඟ ඔබේ දැනුම
            පරීක්ෂා කරන්න.
          </p>
          <p class="landing__desc-en text-muted">
            Practice MCQ papers from past examinations (2017–2025). Designed for
            Sri Lankan Government Pirivena schools.
          </p>
          <div class="landing__actions">
            <button
              mat-flat-button
              color="primary"
              routerLink="/login"
              class="landing__btn"
            >
              <mat-icon>login</mat-icon>
              පිවිසීම / Login
            </button>
            <button
              mat-stroked-button
              color="primary"
              routerLink="/register"
              class="landing__btn"
            >
              <mat-icon>person_add</mat-icon>
              ලියාපදිංචිය / Register
            </button>
          </div>
        </div>

        <div class="landing__features">
          <div class="feature-card" *ngFor="let f of features">
            <mat-icon class="feature-card__icon" [style.color]="f.color">{{
              f.icon
            }}</mat-icon>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>

      <footer class="landing__footer">
        <p>© 2025 පිරිවෙන් MCQ පද්ධතිය | ශ්‍රී ලංකා රජයේ පිරිවෙන් අධ්‍යාපනය</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .landing {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(160deg, #f6f7fb 0%, #e8eaf6 100%);
      }
      .landing__hero {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        text-align: center;
      }
      .landing__hero-content {
        max-width: 600px;
      }
      .landing__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0b3d91, #315aa7);
        margin-bottom: 24px;
        box-shadow: 0 8px 24px rgba(11, 61, 145, 0.25);
      }
      .landing__logo-icon {
        color: #f4b400;
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
      .landing__title {
        font-size: 40px;
        font-weight: 800;
        color: #0b3d91;
        margin-bottom: 8px;
      }
      .landing__subtitle {
        font-size: 18px;
        font-weight: 500;
        color: #555770;
        margin-bottom: 20px;
      }
      .landing__desc {
        font-size: 15px;
        line-height: 1.8;
        color: #333;
        margin-bottom: 12px;
      }
      .landing__desc-en {
        font-size: 13px;
        margin-bottom: 32px;
      }
      .landing__actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 48px;
      }
      .landing__btn {
        height: 48px !important;
        padding: 0 32px !important;
        font-size: 15px;
      }
      .landing__features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        max-width: 900px;
        width: 100%;
      }
      .feature-card {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        text-align: left;
        border: 1px solid #e0e3eb;

        h3 {
          font-size: 15px;
          font-weight: 700;
          margin: 12px 0 6px;
          color: #1a1a2e;
        }
        p {
          font-size: 13px;
          color: #555770;
          line-height: 1.6;
        }
      }
      .feature-card__icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .landing__footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #888;
      }
      @media (max-width: 600px) {
        .landing__title {
          font-size: 28px;
        }
        .landing__subtitle {
          font-size: 15px;
        }
      }
    `,
  ],
})
export class LandingComponent {
  features = [
    {
      icon: 'quiz',
      color: '#0B3D91',
      title: 'අතීත ප්‍රශ්න පත්‍ර',
      desc: '2017–2025 වර්ෂ සඳහා ප්‍රශ්න පත්‍ර 81ක්',
    },
    {
      icon: 'timer',
      color: '#F4B400',
      title: 'කාලගත විභාග',
      desc: 'ප්‍රශ්නයකට තත්පර 30 | මුළු මිනිත්තු 20',
    },
    {
      icon: 'trending_up',
      color: '#2e7d32',
      title: 'ප්‍රගති නිරීක්ෂණය',
      desc: 'ඔබේ ලකුණු හා දියුණුව බලන්න',
    },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    if (this.auth.isAuthenticated) {
      this.auth.navigateByRole();
    }
  }
}
