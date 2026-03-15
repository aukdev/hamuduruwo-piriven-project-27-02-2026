import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing">
      <!-- ═══ HERO SECTION ═══ -->
      <section class="hero">
        <div class="hero__overlay"></div>
        <div class="hero__content">
          <div class="hero__badge">
            <mat-icon>verified</mat-icon>
            ශ්‍රී ලංකා රජයේ පිරිවෙන් අධ්‍යාපනය
          </div>
          <h1 class="hero__title">පිරිවෙන් MCQ</h1>
          <h2 class="hero__subtitle">අතීත ප්‍රශ්න පත්‍ර පද්ධතිය</h2>
          <p class="hero__desc">
            ශ්‍රී ලංකා රජයේ පිරිවෙන් පාසල් සඳහා නිර්මාණය කරන ලද බහුවරණ ප්‍රශ්න
            පුහුණු වේදිකාව. 2017 සිට 2025 දක්වා අතීත ප්‍රශ්න පත්‍ර සමඟ ඔබේ දැනුම
            පරීක්ෂා කරන්න.
          </p>
          <p class="hero__desc-en">
            Practice MCQ papers from past examinations (2017–2025).<br />
            Designed for Sri Lankan Government Pirivena schools.
          </p>
          <div class="hero__actions">
            <button
              mat-flat-button
              routerLink="/register"
              class="hero__btn hero__btn--primary"
            >
              <mat-icon>person_add</mat-icon>
              දැන්ම ලියාපදිංචි වන්න / Register Now
            </button>
            <button
              mat-stroked-button
              routerLink="/login"
              class="hero__btn hero__btn--outline"
            >
              <mat-icon>login</mat-icon>
              පිවිසීම / Login
            </button>
          </div>
        </div>
        <div class="hero__image">
          <img
            src="https://images.unsplash.com/photo-1588580261028-0e8a3c23e1ae?w=700&q=80"
            alt="Pirivena education"
            loading="eager"
          />
        </div>
      </section>

      <!-- ═══ FEATURES SECTION ═══ -->
      <section class="features">
        <div class="features__header">
          <h2 class="section-title">විශේෂාංග / Features</h2>
          <p class="section-subtitle">
            ඔබේ අධ්‍යාපනික ගමන සඳහා අවශ්‍ය සියලු මෙවලම් එක තැනකින්
          </p>
        </div>
        <div class="features__grid">
          <div class="feature-card" *ngFor="let f of features">
            <div class="feature-card__icon-wrap" [style.background]="f.bg">
              <mat-icon [style.color]="f.color">{{ f.icon }}</mat-icon>
            </div>
            <h3>{{ f.title }}</h3>
            <p class="feature-card__title-en">{{ f.titleEn }}</p>
            <p class="feature-card__desc">{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ═══ HOW IT WORKS ═══ -->
      <section class="steps">
        <div class="steps__header">
          <h2 class="section-title">ක්‍රියාවලිය / How It Works</h2>
          <p class="section-subtitle">
            සරල පියවර 3කින් ඔබේ විභාග පුහුණුව ආරම්භ කරන්න
          </p>
        </div>
        <div class="steps__grid">
          <div class="step" *ngFor="let s of steps; let i = index">
            <div class="step__number">{{ i + 1 }}</div>
            <div class="step__icon-wrap">
              <mat-icon>{{ s.icon }}</mat-icon>
            </div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.titleEn }}</p>
            <p class="step__desc">{{ s.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ═══ CTA SECTION ═══ -->
      <section class="cta">
        <div class="cta__inner">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80"
            alt="Students studying"
            class="cta__image"
            loading="lazy"
          />
          <div class="cta__content">
            <h2>දැන්ම ආරම්භ කරන්න</h2>
            <h3>Start Your Journey Today</h3>
            <p>
              අතීත ප්‍රශ්න පත්‍ර සමඟ ඔබේ විභාග සූදානම වැඩි දියුණු කරගන්න. නොමිලේ
              ලියාපදිංචි වී ඔබේ අධ්‍යාපනික ගමන ආරම්භ කරන්න.
            </p>
            <p class="cta__desc-en">
              Improve exam readiness with past papers. Register free and start
              learning.
            </p>
            <button mat-flat-button routerLink="/register" class="cta__btn">
              <mat-icon>rocket_launch</mat-icon>
              නොමිලේ ලියාපදිංචි වන්න / Register Free
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .landing {
        background: #f6f7fb;
      }

      /* ══ HERO ══ */
      .hero {
        position: relative;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 80px 40px 60px;
        background: linear-gradient(
          135deg,
          #0b3d91 0%,
          #152e6e 60%,
          #0a1628 100%
        );
        overflow: hidden;
      }
      .hero__overlay {
        position: absolute;
        inset: 0;
        background: url('https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1600&q=70')
          center/cover;
        opacity: 0.08;
      }
      .hero__content {
        position: relative;
        z-index: 1;
        flex: 1;
        max-width: 580px;
      }
      .hero__badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(244, 180, 0, 0.15);
        color: #f4b400;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 24px;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
      .hero__title {
        font-size: 52px;
        font-weight: 900;
        color: #fff;
        margin-bottom: 8px;
        line-height: 1.1;
      }
      .hero__subtitle {
        font-size: 22px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 20px;
      }
      .hero__desc {
        font-size: 15px;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 8px;
      }
      .hero__desc-en {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.45);
        margin-bottom: 32px;
      }
      .hero__actions {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
      }
      .hero__btn {
        height: 50px !important;
        padding: 0 28px !important;
        font-size: 14px !important;
        border-radius: 10px !important;
        mat-icon {
          margin-right: 6px;
        }
      }
      .hero__btn--primary {
        background: #f4b400 !important;
        color: #0a1628 !important;
        font-weight: 700 !important;
        &:hover {
          background: #e5a800 !important;
        }
      }
      .hero__btn--outline {
        border-color: rgba(255, 255, 255, 0.4) !important;
        color: #fff !important;
        &:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
      }
      .hero__image {
        position: relative;
        z-index: 1;
        flex: 0 0 400px;
        margin-left: 60px;
        img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          object-fit: cover;
          max-height: 450px;
        }
      }

      /* ══ SECTIONS COMMON ══ */
      .section-title {
        font-size: 32px;
        font-weight: 800;
        color: #0b3d91;
        text-align: center;
        margin-bottom: 8px;
      }
      .section-subtitle {
        font-size: 15px;
        color: #555770;
        text-align: center;
        margin-bottom: 48px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.7;
      }

      /* ══ FEATURES ══ */
      .features {
        padding: 80px 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .features__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      .feature-card {
        background: #fff;
        border-radius: 16px;
        padding: 32px 28px;
        border: 1px solid #e8eaf0;
        transition: all 0.3s ease;
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(11, 61, 145, 0.1);
          border-color: #c5cee0;
        }
      }
      .feature-card__icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18px;
        mat-icon {
          font-size: 26px;
          width: 26px;
          height: 26px;
        }
      }
      .feature-card h3 {
        font-size: 16px;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 2px;
      }
      .feature-card__title-en {
        font-size: 12px;
        color: #888;
        margin-bottom: 10px;
      }
      .feature-card__desc {
        font-size: 13px;
        color: #555770;
        line-height: 1.7;
      }

      /* ══ STEPS ══ */
      .steps {
        padding: 80px 24px;
        background: linear-gradient(180deg, #eef1f8 0%, #f6f7fb 100%);
      }
      .steps__grid {
        max-width: 900px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
        text-align: center;
      }
      .step {
        position: relative;
      }
      .step__number {
        position: absolute;
        top: -12px;
        right: calc(50% - 56px);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #f4b400;
        color: #0a1628;
        font-size: 13px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }
      .step__icon-wrap {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: linear-gradient(135deg, #0b3d91, #315aa7);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        box-shadow: 0 8px 24px rgba(11, 61, 145, 0.2);
        mat-icon {
          color: #f4b400;
          font-size: 36px;
          width: 36px;
          height: 36px;
        }
      }
      .step h3 {
        font-size: 16px;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 2px;
      }
      .step > p:not(.step__desc) {
        font-size: 12px;
        color: #888;
        margin-bottom: 10px;
      }
      .step__desc {
        font-size: 13px;
        color: #555770;
        line-height: 1.7;
      }

      /* ══ CTA ══ */
      .cta {
        padding: 80px 24px;
        max-width: 1100px;
        margin: 0 auto;
      }
      .cta__inner {
        background: linear-gradient(135deg, #0b3d91, #152e6e);
        border-radius: 24px;
        display: flex;
        align-items: center;
        overflow: hidden;
      }
      .cta__image {
        width: 380px;
        height: 340px;
        object-fit: cover;
        flex-shrink: 0;
      }
      .cta__content {
        padding: 48px;
        h2 {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }
        h3 {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 16px;
        }
        p {
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }
      }
      .cta__desc-en {
        font-size: 12px !important;
        color: rgba(255, 255, 255, 0.4) !important;
        margin-bottom: 24px !important;
      }
      .cta__btn {
        height: 48px !important;
        padding: 0 28px !important;
        background: #f4b400 !important;
        color: #0a1628 !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        border-radius: 10px !important;
        mat-icon {
          margin-right: 6px;
        }
        &:hover {
          background: #e5a800 !important;
        }
      }

      /* ══ RESPONSIVE ══ */
      @media (max-width: 1024px) {
        .hero {
          flex-direction: column;
          text-align: center;
          padding: 60px 24px 48px;
          min-height: auto;
        }
        .hero__content {
          max-width: 100%;
        }
        .hero__actions {
          justify-content: center;
        }
        .hero__image {
          margin-left: 0;
          margin-top: 40px;
          flex: 0 0 auto;
          max-width: 400px;
        }
      }
      @media (max-width: 768px) {
        .hero__title {
          font-size: 36px;
        }
        .hero__subtitle {
          font-size: 18px;
        }
        .hero__image {
          max-width: 320px;
        }
        .features__grid {
          grid-template-columns: 1fr;
        }
        .steps__grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .cta__inner {
          flex-direction: column;
        }
        .cta__image {
          width: 100%;
          height: 220px;
        }
        .cta__content {
          padding: 32px 24px;
          text-align: center;
        }
      }
      @media (max-width: 480px) {
        .hero__title {
          font-size: 28px;
        }
        .hero__btn {
          width: 100%;
          justify-content: center;
        }
        .section-title {
          font-size: 24px;
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
      bg: 'rgba(11, 61, 145, 0.08)',
      title: 'අතීත ප්‍රශ්න පත්‍ර',
      titleEn: 'Past Papers',
      desc: '2017 සිට 2025 දක්වා අතීත ප්‍රශ්න පත්‍ර 81ක් පුහුණුව සඳහා ලබා ගත හැක.',
    },
    {
      icon: 'timer',
      color: '#F4B400',
      bg: 'rgba(244, 180, 0, 0.1)',
      title: 'කාලගත විභාග',
      titleEn: 'Timed Exams',
      desc: 'සැබෑ විභාග පරිසරයක් — ප්‍රශ්නයකට තත්පර 30ක් | මුළු මිනිත්තු 20ක්.',
    },
    {
      icon: 'trending_up',
      color: '#2e7d32',
      bg: 'rgba(46, 125, 50, 0.08)',
      title: 'ප්‍රගති නිරීක්ෂණය',
      titleEn: 'Progress Tracking',
      desc: 'ඔබේ ලකුණු, දුර්වල ක්ෂේත්‍ර හා දියුණුව පිළිබඳ සම්පූර්ණ විශ්ලේෂණයක් ලබා ගන්න.',
    },
    {
      icon: 'admin_panel_settings',
      color: '#7b1fa2',
      bg: 'rgba(123, 31, 162, 0.08)',
      title: 'භූමිකා පාදක පිවිසුම',
      titleEn: 'Role-Based Access',
      desc: 'සිසුන්, ගුරුවරුන්, පරිපාලකයින් සඳහා වෙන් වෙන් පරිශීලක පුවරු.',
    },
    {
      icon: 'menu_book',
      color: '#e65100',
      bg: 'rgba(230, 81, 0, 0.08)',
      title: 'විෂය පුළුල් ආවරණය',
      titleEn: 'Subject Coverage',
      desc: 'පාලි, සංස්කෘත, බුද්ධ ධර්මය, සිංහල ඇතුළු විෂයයන් 5ක් ආවරණය කරයි.',
    },
    {
      icon: 'devices',
      color: '#00838f',
      bg: 'rgba(0, 131, 143, 0.08)',
      title: 'ඕනෑම උපාංගයකින්',
      titleEn: 'Any Device',
      desc: 'පරිගණකය, ටැබ්ලටය හෝ දුරකථනය — ඕනෑම උපාංගයකින් ප්‍රවේශ විය හැක.',
    },
  ];

  steps = [
    {
      icon: 'person_add',
      title: 'ලියාපදිංචි වන්න',
      titleEn: 'Register',
      desc: 'නොමිලේ ගිණුමක් සාදා ඔබේ භූමිකාව තෝරන්න — සිසුවෙක් හෝ ගුරුවරයෙක්.',
    },
    {
      icon: 'touch_app',
      title: 'ප්‍රශ්න පත්‍රය තෝරන්න',
      titleEn: 'Select a Paper',
      desc: 'වර්ෂය හා විෂය අනුව ප්‍රශ්න පත්‍ර බලා ඔබට අවශ්‍ය එක තෝරන්න.',
    },
    {
      icon: 'emoji_events',
      title: 'විභාගය කරන්න',
      titleEn: 'Take the Exam',
      desc: 'කාලය ගත වන විභාගය සම්පූර්ණ කර ක්ෂණික ලකුණු ලබා ගන්න.',
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
