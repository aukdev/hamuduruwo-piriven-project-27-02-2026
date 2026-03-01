import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  template: `
    <app-page-header
      title="පරිශීලක කළමනාකරණය"
      subtitle="ගුරුවරුන් සත්‍යාපනය සහ පරිශීලක අක්‍රිය කිරීම"
    >
    </app-page-header>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <!-- Filter tabs -->
    <mat-tab-group
      (selectedTabChange)="filterByTab($event.index)"
      class="mb-16"
    >
      <mat-tab label="සියල්ලම ({{ users.length }})"></mat-tab>
      <mat-tab label="ගුරුවරුන් ({{ getTeachers().length }})"></mat-tab>
      <mat-tab label="සෙසු ({{ getStudents().length }})"></mat-tab>
    </mat-tab-group>

    <div class="users-list" *ngIf="!loading">
      <mat-card class="user-card" *ngFor="let u of filteredUsers">
        <div class="user-card__main">
          <div class="user-avatar">{{ getInitials(u.fullName) }}</div>
          <div class="user-info">
            <h4>{{ u.fullName }}</h4>
            <span class="user-email">{{ u.email }}</span>
            <div class="user-badges">
              <span class="role-badge role-{{ u.role }}">{{
                getRoleLabel(u.role)
              }}</span>
              <span
                class="status-badge"
                [class.active]="u.status === 'ACTIVE'"
                [class.deactivated]="u.status === 'DEACTIVATED'"
              >
                {{ u.status === 'ACTIVE' ? 'සක්‍රිය' : 'අක්‍රිය' }}
              </span>
              <span
                class="verify-badge unverified"
                *ngIf="u.role === 'TEACHER' && !u.teacherVerified"
              >
                <mat-icon>warning_amber</mat-icon> සත්‍යාපනය නැත
              </span>
              <span
                class="verify-badge verified"
                *ngIf="u.role === 'TEACHER' && u.teacherVerified"
              >
                <mat-icon>verified</mat-icon> සත්‍යාපිත
              </span>
            </div>
          </div>
          <div class="user-actions">
            <button
              mat-stroked-button
              color="primary"
              *ngIf="u.role === 'TEACHER' && !u.teacherVerified"
              (click)="verifyTeacher(u)"
            >
              <mat-icon>verified_user</mat-icon> සත්‍යාපනය
            </button>
            <button
              mat-stroked-button
              color="warn"
              *ngIf="u.status === 'ACTIVE'"
              (click)="deactivateUser(u)"
            >
              <mat-icon>block</mat-icon> අක්‍රිය
            </button>
          </div>
        </div>
        <span class="user-date"
          >ලියාපදිංචිය: {{ u.createdAt | date: 'yyyy-MM-dd' }}</span
        >
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && filteredUsers.length === 0"
      icon="people"
      title="පරිශීලකයින් නොමැත"
      message="මෙම ප්‍රවර්ගයේ පරිශීලකයින් නොමැත."
    >
    </app-empty-state>

    <mat-paginator
      *ngIf="totalElements > pageSize"
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="currentPage"
      (page)="onPageChange($event)"
      [hidePageSize]="true"
    >
    </mat-paginator>
  `,
  styles: [
    `
      .users-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .user-card {
        padding: 18px 22px !important;
      }
      .user-card__main {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .user-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0b3d91;
        color: #fff;
        font-weight: 700;
        font-size: 15px;
        flex-shrink: 0;
      }
      .user-info {
        flex: 1;
        min-width: 200px;
      }
      .user-info h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #1a1a2e;
      }
      .user-email {
        font-size: 13px;
        color: #666;
      }
      .user-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      .status-badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
        &.active {
          background: #e8f5e9;
          color: #2e7d32;
        }
        &.deactivated {
          background: #fce4ec;
          color: #c62828;
        }
      }
      .verify-badge {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
        &.unverified {
          background: #fff3e0;
          color: #e65100;
        }
        &.verified {
          background: #e8f5e9;
          color: #2e7d32;
        }
      }
      .user-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        button {
          font-size: 13px;
        }
      }
      .user-date {
        font-size: 11px;
        color: #999;
        margin-top: 6px;
        display: block;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 30;
  totalElements = 0;
  currentTab = 0;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.api.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalElements = res.totalElements;
        this.filterByTab(this.currentTab);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterByTab(index: number): void {
    this.currentTab = index;
    if (index === 0) this.filteredUsers = this.users;
    else if (index === 1) this.filteredUsers = this.getTeachers();
    else this.filteredUsers = this.getStudents();
  }

  getTeachers(): UserDto[] {
    return this.users.filter((u) => u.role === 'TEACHER');
  }
  getStudents(): UserDto[] {
    return this.users.filter((u) => u.role === 'STUDENT');
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      STUDENT: 'ශිෂ්‍යයා',
      TEACHER: 'ගුරුවරයා',
      ADMIN: 'පරිපාලක',
      SUPER_ADMIN: 'ප්‍රධාන පරිපාලක',
    };
    return map[role] || role;
  }

  verifyTeacher(u: UserDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ගුරුවරයා සත්‍යාපනය',
        message: `"${u.fullName}" (${u.email}) ගුරුවරයා ලෙස සත්‍යාපනය කිරීමට අවශ්‍යද?`,
        confirmText: 'සත්‍යාපනය කරන්න',
      },
      width: '400px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.verifyTeacher(u.id).subscribe({
          next: () => {
            this.notify.success('ගුරුවරයා සත්‍යාපනය කරන ලදී!');
            this.loadUsers();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'සත්‍යාපනය අසාර්ථකයි.'),
        });
      }
    });
  }

  deactivateUser(u: UserDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පරිශීලකයා අක්‍රිය කරන්න',
        message: `"${u.fullName}" (${u.email}) අක්‍රිය කිරීමට අවශ්‍යද? මෙම ක්‍රියාව ආපසු හැරවිය හැක.`,
        confirmText: 'අක්‍රිය කරන්න',
        dangerous: true,
      },
      width: '420px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deactivateUser(u.id).subscribe({
          next: () => {
            this.notify.success('පරිශීලකයා අක්‍රිය කරන ලදී.');
            this.loadUsers();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'අක්‍රිය කිරීම අසාර්ථකයි.'),
        });
      }
    });
  }
}
