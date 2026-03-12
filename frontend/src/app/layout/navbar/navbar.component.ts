import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar class="navbar">
      <button
        mat-icon-button
        (click)="toggleSidenav()"
        class="navbar__menu-btn"
      >
        <mat-icon>menu</mat-icon>
      </button>

      <div class="navbar__brand" routerLink="/">
        <div class="navbar__logo">
          <mat-icon class="navbar__logo-icon">school</mat-icon>
        </div>
        <div class="navbar__brand-text hide-mobile">
          <span class="navbar__app-name">පිරිවෙන් MCQ</span>
          <span class="navbar__app-sub">අතීත ප්‍රශ්න පත්‍ර පද්ධතිය</span>
        </div>
      </div>

      <span class="navbar__spacer"></span>

      <span class="role-badge role-{{ user?.role }}" *ngIf="user">
        {{ getRoleSinhala(user.role) }}
      </span>

      <button mat-icon-button [matMenuTriggerFor]="profileMenu" *ngIf="user">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #profileMenu="matMenu">
        <div class="profile-menu-header">
          <strong>{{ user?.fullName }}</strong>
          <small>{{ user?.email }}</small>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>පිටවීම</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [
    `
      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 64px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .navbar__menu-btn {
        display: none;
      }
      .navbar__brand {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        text-decoration: none;
      }
      .navbar__logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #0b3d91, #315aa7);
      }
      .navbar__logo-icon {
        color: #f4b400;
        font-size: 24px;
      }
      .navbar__brand-text {
        display: flex;
        flex-direction: column;
      }
      .navbar__app-name {
        font-size: 16px;
        font-weight: 700;
        color: #0b3d91;
        line-height: 1.2;
      }
      .navbar__app-sub {
        font-size: 10px;
        color: #555770;
        line-height: 1.2;
      }
      .navbar__spacer {
        flex: 1;
      }
      .profile-menu-header {
        padding: 12px 16px;
        display: flex;
        flex-direction: column;

        strong {
          font-size: 14px;
          color: #1a1a2e;
        }
        small {
          font-size: 12px;
          color: #555770;
          margin-top: 2px;
        }
      }
      @media (max-width: 768px) {
        .navbar__menu-btn {
          display: flex;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  sidenavOpen = true;
  user = this.auth.currentUser;
  private sub!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((u) => (this.user = u));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
    // Emit event via a simple callback approach
    (window as any).__toggleSidenav?.();
  }

  getRoleSinhala(role: string): string {
    const map: Record<string, string> = {
      SUPER_ADMIN: 'ප්‍රධාන පරිපාලක',
      ADMIN: 'පරිපාලක',
      TEACHER: 'ගුරුවරයා',
      STUDENT: 'ශිෂ්‍යයා',
    };
    return map[role] || role;
  }

  logout(): void {
    this.auth.logout();
  }
}
