import { Component, OnInit } from '@angular/core';
import { AuthService, CurrentUser } from '../../core/services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar">
      <nav class="sidebar__nav">
        <a
          *ngFor="let item of navItems"
          class="sidebar__link"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{
            exact: item.route.endsWith('dashboard'),
          }"
        >
          <mat-icon class="sidebar__link-icon">{{ item.icon }}</mat-icon>
          <span class="sidebar__link-label">{{ item.label }}</span>
        </a>
      </nav>
    </div>
  `,
  styles: [
    `
      .sidebar {
        padding: 16px 8px;
      }
      .sidebar__nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .sidebar__link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        border-radius: 10px;
        color: #555770;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.15s ease;
      }
      .sidebar__link:hover {
        background: rgba(11, 61, 145, 0.06);
        color: #0b3d91;
        text-decoration: none;
      }
      .sidebar__link.active {
        background: rgba(11, 61, 145, 0.1);
        color: #0b3d91;
        font-weight: 600;
      }
      .sidebar__link-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        opacity: 0.8;
      }
      .sidebar__link.active .sidebar__link-icon {
        opacity: 1;
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      this.navItems = user ? this.getNavItems(user) : [];
    });
  }

  private getNavItems(user: CurrentUser): NavItem[] {
    switch (user.role) {
      case 'STUDENT':
        return [
          {
            icon: 'dashboard',
            label: 'මුල් පිටුව',
            route: '/student/dashboard',
          },
          {
            icon: 'calendar_today',
            label: 'වර්ෂ තෝරන්න',
            route: '/student/years',
          },
        ];
      case 'TEACHER':
        return [
          {
            icon: 'dashboard',
            label: 'මුල් පිටුව',
            route: '/teacher/dashboard',
          },
          {
            icon: 'add_circle',
            label: 'ප්‍රශ්නයක් සාදන්න',
            route: '/teacher/questions/create',
          },
          {
            icon: 'list_alt',
            label: 'මගේ ප්‍රශ්න',
            route: '/teacher/questions',
          },
        ];
      case 'ADMIN':
        return [
          { icon: 'dashboard', label: 'මුල් පිටුව', route: '/admin/dashboard' },
          {
            icon: 'pending_actions',
            label: 'අනුමත කිරීම්',
            route: '/admin/pending',
          },
          { icon: 'people', label: 'පරිශීලකයින්', route: '/admin/users' },
        ];
      case 'SUPER_ADMIN':
        return [
          {
            icon: 'dashboard',
            label: 'මුල් පිටුව',
            route: '/superadmin/dashboard',
          },
          {
            icon: 'pending_actions',
            label: 'අනුමත කිරීම්',
            route: '/superadmin/pending',
          },
          {
            icon: 'quiz',
            label: 'ප්‍රශ්න කළමනාකරණය',
            route: '/superadmin/questions',
          },
          { icon: 'people', label: 'පරිශීලකයින්', route: '/superadmin/users' },
        ];
      default:
        return [];
    }
  }
}
