import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  UserDto,
  UserUpdateRequest,
  CreateUserRequest,
} from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditUserDialogComponent } from '../../../shared/components/edit-user-dialog/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from '../../../shared/components/reset-password-dialog/reset-password-dialog.component';
import { CreateUserDialogComponent } from '../../../shared/components/create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-user-management',
  template: `
    <app-page-header
      title="පරිශීලක කළමනාකරණය"
      subtitle="සියලු පරිශීලකයින් බැලීම, සංස්කරණය, මුරපද යළි පිහිටුවීම"
    >
    </app-page-header>

    <div class="actions-bar">
      <button mat-raised-button color="primary" (click)="createUser()">
        <mat-icon>person_add</mat-icon> නව පරිශීලකයෙකු එක් කරන්න
      </button>
    </div>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <!-- Filter tabs -->
    <mat-tab-group
      (selectedTabChange)="filterByTab($event.index)"
      class="mb-16"
    >
      <mat-tab label="සියල්ලම ({{ totalElements }})"></mat-tab>
      <mat-tab label="ගුරුවරුන්"></mat-tab>
      <mat-tab label="ශිෂ්‍යයින්"></mat-tab>
      <mat-tab label="පරිපාලකයින්"></mat-tab>
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
              mat-icon-button
              color="primary"
              matTooltip="සංස්කරණය"
              (click)="editUser(u)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="මුරපදය යළි පිහිටුවීම"
              (click)="resetPassword(u)"
            >
              <mat-icon>lock_reset</mat-icon>
            </button>
            <button
              mat-icon-button
              color="primary"
              matTooltip="ගුරු සත්‍යාපනය"
              (click)="verifyTeacher(u)"
              *ngIf="u.role === 'TEACHER' && !u.teacherVerified"
            >
              <mat-icon>verified_user</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              matTooltip="අක්‍රිය කරන්න"
              (click)="deactivateUser(u)"
              *ngIf="u.status === 'ACTIVE' && u.role !== 'SUPER_ADMIN'"
            >
              <mat-icon>block</mat-icon>
            </button>
            <button
              mat-icon-button
              color="primary"
              matTooltip="සක්‍රිය කරන්න"
              (click)="activateUser(u)"
              *ngIf="u.status === 'DEACTIVATED'"
            >
              <mat-icon>check_circle</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              matTooltip="ස්ථිරවම මකා දැමීම"
              (click)="deleteUser(u)"
              *ngIf="u.role !== 'SUPER_ADMIN'"
            >
              <mat-icon>delete_forever</mat-icon>
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
        gap: 2px;
        flex-shrink: 0;
      }
      .user-date {
        font-size: 11px;
        color: #999;
        margin-top: 6px;
        display: block;
      }
      .actions-bar {
        margin-bottom: 16px;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 20;
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
    else if (index === 1)
      this.filteredUsers = this.users.filter((u) => u.role === 'TEACHER');
    else if (index === 2)
      this.filteredUsers = this.users.filter((u) => u.role === 'STUDENT');
    else
      this.filteredUsers = this.users.filter(
        (u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN',
      );
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

  editUser(u: UserDto): void {
    const ref = this.dialog.open(EditUserDialogComponent, {
      data: u,
      width: '460px',
    });
    ref.afterClosed().subscribe((result: UserUpdateRequest | undefined) => {
      if (result) {
        this.api.updateUser(u.id, result).subscribe({
          next: () => {
            this.notify.success('පරිශීලක තොරතුරු යාවත්කාලීන කරන ලදී.');
            this.loadUsers();
          },
          error: (err) =>
            this.notify.error(
              err.error?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි.',
            ),
        });
      }
    });
  }

  resetPassword(u: UserDto): void {
    const ref = this.dialog.open(ResetPasswordDialogComponent, {
      data: u,
      width: '440px',
    });
    ref.afterClosed().subscribe((newPassword: string | undefined) => {
      if (newPassword) {
        this.api.resetPassword(u.id, { newPassword }).subscribe({
          next: () => {
            this.notify.success('මුරපදය සාර්ථකව යළි පිහිටුවන ලදී.');
          },
          error: (err) =>
            this.notify.error(
              err.error?.message || 'මුරපදය යළි පිහිටුවීම අසාර්ථකයි.',
            ),
        });
      }
    });
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
        message: `"${u.fullName}" (${u.email}) අක්‍රිය කිරීමට අවශ්‍යද?`,
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

  createUser(): void {
    const ref = this.dialog.open(CreateUserDialogComponent, {
      width: '480px',
    });
    ref.afterClosed().subscribe((result: CreateUserRequest | undefined) => {
      if (result) {
        this.api.createUser(result).subscribe({
          next: () => {
            this.notify.success('නව පරිශීලකයා සාර්ථකව එක් කරන ලදී.');
            this.loadUsers();
          },
          error: (err) =>
            this.notify.error(
              err.error?.message || 'පරිශීලකයා එක් කිරීම අසාර්ථකයි.',
            ),
        });
      }
    });
  }

  activateUser(u: UserDto): void {
    this.api.activateUser(u.id).subscribe({
      next: () => {
        this.notify.success('පරිශීලකයා සක්‍රිය කරන ලදී.');
        this.loadUsers();
      },
      error: (err) =>
        this.notify.error(err.error?.message || 'සක්‍රිය කිරීම අසාර්ථකයි.'),
    });
  }

  deleteUser(u: UserDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පරිශීලකයා මකා දැමීම',
        message: `"${u.fullName}" (${u.email}) ස්ථිරවම මකා දැමීමට අවශ්‍යද?\nමෙම ක්‍රියාව ආපසු හැරවිය නොහැක!`,
        confirmText: 'ස්ථිරවම මකන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deleteUser(u.id).subscribe({
          next: () => {
            this.notify.success('පරිශීලකයා මකා දමන ලදී.');
            this.loadUsers();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
  }
}
