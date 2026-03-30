import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService, CurrentUser } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [];
  private sub!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      this.navItems = user ? this.getNavItems(user) : [];
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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
            icon: 'history_edu',
            label: 'past-paper ප්‍රශ්න පත්‍ර',
            route: '/student/years',
          },
          {
            icon: 'school',
            label: 'පුහුණු ප්‍රශ්න',
            route: '/student/practice',
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
            icon: 'school',
            label: 'පුහුණු පත්‍ර',
            route: '/teacher/practice-papers',
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
          {
            icon: 'assignment',
            label: 'ශිෂ්‍ය පිළිතුරු',
            route: '/teacher/student-answers',
          },
        ];
      case 'ADMIN':
        return [
          { icon: 'dashboard', label: 'මුල් පිටුව', route: '/admin/dashboard' },
          {
            icon: 'pending_actions',
            label: 'ප්‍රශ්න අනුමැතිය',
            route: '/admin/approvals',
          },
          {
            icon: 'rate_review',
            label: 'පුහුණු පත්‍ර කළමනාකරණය',
            route: '/admin/practice-paper-management',
          },
          {
            icon: 'description',
            label: 'past-paper කළමනාකරණය',
            route: '/admin/papers',
          },
          { icon: 'people', label: 'පරිශීලකයින්', route: '/admin/users' },
          {
            icon: 'menu_book',
            label: 'විෂය කළමනාකරණය',
            route: '/admin/subjects',
          },
          {
            icon: 'assignment',
            label: 'ශිෂ්‍ය පිළිතුරු',
            route: '/admin/student-answers',
          },
          {
            icon: 'category',
            label: 'විචාර විෂය කළමනාකරණය',
            route: '/admin/vichara-subjects',
          },
          {
            icon: 'auto_stories',
            label: 'විචාර කළමනාකරණය',
            route: '/admin/vichara',
          },
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
            label: 'ප්‍රශ්න අනුමැතිය',
            route: '/superadmin/approvals',
          },
          {
            icon: 'rate_review',
            label: 'පුහුණු පත්‍ර කළමනාකරණය',
            route: '/superadmin/practice-paper-management',
          },
          {
            icon: 'description',
            label: 'past-paper කළමනාකරණය',
            route: '/superadmin/papers',
          },
          { icon: 'people', label: 'පරිශීලකයින්', route: '/superadmin/users' },
          {
            icon: 'menu_book',
            label: 'විෂය කළමනාකරණය',
            route: '/superadmin/subjects',
          },
          {
            icon: 'assignment',
            label: 'ශිෂ්‍ය පිළිතුරු',
            route: '/superadmin/student-answers',
          },
          {
            icon: 'category',
            label: 'විචාර විෂය කළමනාකරණය',
            route: '/superadmin/vichara-subjects',
          },
          {
            icon: 'auto_stories',
            label: 'විචාර කළමනාකරණය',
            route: '/superadmin/vichara',
          },
        ];
      default:
        return [];
    }
  }
}
