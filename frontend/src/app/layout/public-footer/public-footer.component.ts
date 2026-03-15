import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-public-footer',
  template: `
    <!-- Stats Counter Band -->
    <section class="stats">
      <div class="stats__inner">
        <div class="stats__item" *ngFor="let s of stats">
          <mat-icon class="stats__icon">{{ s.icon }}</mat-icon>
          <span class="stats__number">{{ s.value | number }}</span>
          <span class="stats__label">{{ s.label }}</span>
          <span class="stats__label-en">{{ s.labelEn }}</span>
        </div>
      </div>
    </section>

    <!-- Main Footer -->
    <footer class="ft">
      <div class="ft__inner">
        <!-- Col 1: Brand -->
        <div class="ft__col ft__col--brand">
          <div class="ft__brand">
            <div class="ft__logo">
              <mat-icon>school</mat-icon>
            </div>
            <span class="ft__brand-text">පිරිවෙන් MCQ</span>
          </div>
          <p class="ft__desc">
            ශ්‍රී ලංකා රජයේ පිරිවෙන් පාසල් සඳහා නිර්මාණය කරන ලද බහුවරණ ප්‍රශ්න
            පුහුණු වේදිකාව.
          </p>
          <p class="ft__desc-en">
            MCQ practice platform for Sri Lankan Government Pirivena schools.
          </p>
        </div>

        <!-- Col 2: Quick Links -->
        <div class="ft__col">
          <h4 class="ft__heading">ඉක්මන් සබැඳි / Quick Links</h4>
          <nav class="ft__links">
            <a routerLink="/">මුල් පිටුව / Home</a>
            <a routerLink="/about">අපි ගැන / About</a>
            <a routerLink="/vision-mission">දැක්ම හා මෙහෙවර</a>
            <a routerLink="/contact">සම්බන්ධ වන්න / Contact</a>
          </nav>
        </div>

        <!-- Col 3: Legal -->
        <div class="ft__col">
          <h4 class="ft__heading">නීතිමය / Legal</h4>
          <nav class="ft__links">
            <a routerLink="/privacy-policy">පෞද්ගලිකත්ව ප්‍රතිපත්තිය</a>
            <a routerLink="/terms">නියම හා කොන්දේසි</a>
            <a routerLink="/login">පිවිසීම / Login</a>
            <a routerLink="/register">ලියාපදිංචිය / Register</a>
          </nav>
        </div>

        <!-- Col 4: Contact -->
        <div class="ft__col">
          <h4 class="ft__heading">සම්බන්ධ වන්න / Contact</h4>
          <div class="ft__contact">
            <div class="ft__contact-item">
              <mat-icon>email</mat-icon>
              <span>info&#64;pirivenmcq.lk</span>
            </div>
            <div class="ft__contact-item">
              <mat-icon>phone</mat-icon>
              <span>+94 11 234 5678</span>
            </div>
            <div class="ft__contact-item">
              <mat-icon>location_on</mat-icon>
              <span>කොළඹ, ශ්‍රී ලංකාව</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="ft__bottom">
        <p>
          &copy; {{ currentYear }} පිරිවෙන් MCQ පද්ධතිය | ශ්‍රී ලංකා රජයේ
          පිරිවෙන් අධ්‍යාපනය
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      /* ── Stats Counter Band ── */
      .stats {
        background: linear-gradient(135deg, #0b3d91, #152e6e);
        padding: 48px 24px;
      }
      .stats__inner {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        text-align: center;
      }
      .stats__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .stats__icon {
        color: #f4b400;
        font-size: 36px;
        width: 36px;
        height: 36px;
        margin-bottom: 8px;
      }
      .stats__number {
        font-size: 36px;
        font-weight: 800;
        color: #fff;
        line-height: 1;
      }
      .stats__label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 4px;
      }
      .stats__label-en {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
      }

      /* ── Footer ── */
      .ft {
        background: #0a1628;
        color: rgba(255, 255, 255, 0.85);
      }
      .ft__inner {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 40px;
        padding: 48px 24px;
      }
      .ft__brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }
      .ft__logo {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #315aa7, #4a7cd8);
        display: flex;
        align-items: center;
        justify-content: center;
        mat-icon {
          color: #f4b400;
          font-size: 22px;
          width: 22px;
          height: 22px;
        }
      }
      .ft__brand-text {
        font-size: 18px;
        font-weight: 800;
        color: #fff;
      }
      .ft__desc {
        font-size: 13px;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 8px;
      }
      .ft__desc-en {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
      .ft__heading {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #f4b400;
        display: inline-block;
      }
      .ft__links {
        display: flex;
        flex-direction: column;
        gap: 10px;
        a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
          &:hover {
            color: #f4b400;
          }
        }
      }
      .ft__contact {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ft__contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        mat-icon {
          color: #f4b400;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
      .ft__bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 20px 24px;
        text-align: center;
        p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }
      }

      @media (max-width: 768px) {
        .stats__inner {
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }
        .stats__number {
          font-size: 28px;
        }
        .ft__inner {
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 32px 20px;
        }
      }
      @media (max-width: 480px) {
        .stats {
          padding: 32px 16px;
        }
        .stats__number {
          font-size: 24px;
        }
        .stats__icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }
    `,
  ],
})
export class PublicFooterComponent implements OnInit {
  currentYear = new Date().getFullYear();

  stats = [
    { icon: 'people', value: 0, label: 'සිසුන්', labelEn: 'Students' },
    {
      icon: 'cast_for_education',
      value: 0,
      label: 'ගුරුවරුන්',
      labelEn: 'Teachers',
    },
    {
      icon: 'description',
      value: 0,
      label: 'ප්‍රශ්න පත්‍ර',
      labelEn: 'Papers',
    },
    { icon: 'menu_book', value: 0, label: 'විෂයයන්', labelEn: 'Subjects' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPublicStats().subscribe({
      next: (data) => {
        this.stats[0].value = data.studentCount;
        this.stats[1].value = data.teacherCount;
        this.stats[2].value = data.paperCount;
        this.stats[3].value = data.subjectCount;
      },
      error: () => {
        // Fallback values when API is unavailable
        this.stats[0].value = 150;
        this.stats[1].value = 25;
        this.stats[2].value = 81;
        this.stats[3].value = 5;
      },
    });
  }
}
