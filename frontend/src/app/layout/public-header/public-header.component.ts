import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-public-header',
  template: `
    <header class="ph" [class.ph--scrolled]="scrolled">
      <div class="ph__inner">
        <!-- Logo -->
        <a routerLink="/" class="ph__brand">
          <div class="ph__logo">
            <mat-icon>school</mat-icon>
          </div>
          <span class="ph__brand-text">පිරිවෙන් MCQ</span>
        </a>

        <!-- Desktop Nav -->
        <nav class="ph__nav">
          <a
            routerLink="/"
            routerLinkActive="ph__nav-link--active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="ph__nav-link"
            >මුල් පිටුව</a
          >
          <a
            routerLink="/about"
            routerLinkActive="ph__nav-link--active"
            class="ph__nav-link"
            >අපි ගැන</a
          >
          <a
            routerLink="/vision-mission"
            routerLinkActive="ph__nav-link--active"
            class="ph__nav-link"
            >දැක්ම හා මෙහෙවර</a
          >
          <a
            routerLink="/contact"
            routerLinkActive="ph__nav-link--active"
            class="ph__nav-link"
            >සම්බන්ධ වන්න</a
          >
        </nav>

        <!-- Auth Buttons -->
        <div class="ph__actions">
          <a
            mat-stroked-button
            routerLink="/login"
            class="ph__btn ph__btn--login"
          >
            <mat-icon>login</mat-icon>
            පිවිසීම
          </a>
          <a
            mat-flat-button
            color="primary"
            routerLink="/register"
            class="ph__btn ph__btn--register"
          >
            <mat-icon>person_add</mat-icon>
            ලියාපදිංචිය
          </a>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          mat-icon-button
          class="ph__hamburger"
          (click)="mobileMenuOpen = !mobileMenuOpen"
        >
          <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        class="ph__mobile"
        *ngIf="mobileMenuOpen"
        (click)="mobileMenuOpen = false"
      >
        <a routerLink="/" class="ph__mobile-link">මුල් පිටුව / Home</a>
        <a routerLink="/about" class="ph__mobile-link">අපි ගැන / About</a>
        <a routerLink="/vision-mission" class="ph__mobile-link"
          >දැක්ම හා මෙහෙවර</a
        >
        <a routerLink="/contact" class="ph__mobile-link"
          >සම්බන්ධ වන්න / Contact</a
        >
        <mat-divider></mat-divider>
        <a routerLink="/login" class="ph__mobile-link ph__mobile-link--primary">
          <mat-icon>login</mat-icon> පිවිසීම / Login
        </a>
        <a
          routerLink="/register"
          class="ph__mobile-link ph__mobile-link--accent"
        >
          <mat-icon>person_add</mat-icon> ලියාපදිංචිය / Register
        </a>
      </div>
    </header>
  `,
  styles: [
    `
      .ph {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.3s ease;
        border-bottom: 1px solid transparent;
      }
      .ph--scrolled {
        background: rgba(255, 255, 255, 0.97);
        border-bottom-color: #e0e3eb;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      }
      .ph__inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        height: 68px;
      }
      .ph__brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: #0b3d91;
      }
      .ph__logo {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #0b3d91, #315aa7);
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
      .ph__brand-text {
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.3px;
      }
      .ph__nav {
        display: flex;
        gap: 8px;
      }
      .ph__nav-link {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #444;
        text-decoration: none;
        transition: all 0.2s ease;
        &:hover {
          background: rgba(11, 61, 145, 0.06);
          color: #0b3d91;
        }
      }
      .ph__nav-link--active {
        color: #0b3d91;
        background: rgba(11, 61, 145, 0.08);
        font-weight: 600;
      }
      .ph__actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .ph__btn {
        font-size: 13px !important;
        height: 38px !important;
        padding: 0 18px !important;
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          margin-right: 4px;
        }
      }
      .ph__hamburger {
        display: none;
      }
      .ph__mobile {
        display: none;
        flex-direction: column;
        padding: 8px 16px 16px;
        background: #fff;
        border-top: 1px solid #e0e3eb;
      }
      .ph__mobile-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        color: #333;
        text-decoration: none;
        &:hover {
          background: rgba(11, 61, 145, 0.04);
        }
      }
      .ph__mobile-link--primary {
        color: #0b3d91;
        font-weight: 600;
      }
      .ph__mobile-link--accent {
        color: #0b3d91;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .ph__nav,
        .ph__actions {
          display: none;
        }
        .ph__hamburger {
          display: inline-flex;
        }
        .ph__mobile {
          display: flex;
        }
        .ph__inner {
          height: 60px;
          padding: 0 16px;
        }
      }
    `,
  ],
})
export class PublicHeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }
}
