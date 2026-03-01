import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-superadmin-users',
  template: `
    <app-page-header
      title="පරිශීලක කළමනාකරණය (සම්පූර්ණ)"
      subtitle="පරිශීලකයින් බැලීම සහ මකා දැමීම"
    >
    </app-page-header>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <div class="users-list" *ngIf="!loading">
      <mat-card class="user-card" *ngFor="let u of users">
        <div class="user-main">
          <div class="user-avatar">{{ getInitials(u.fullName) }}</div>
          <div class="user-info">
            <h4>{{ u.fullName }}</h4>
            <span class="user-email">{{ u.email }}</span>
            <div class="user-meta">
              <span class="role-badge role-{{ u.role }}">{{
                getRoleLabel(u.role)
              }}</span>
              <span
                class="status-chip"
                [class.active]="u.status === 'ACTIVE'"
                [class.deactivated]="u.status === 'DEACTIVATED'"
              >
                {{ u.status === 'ACTIVE' ? 'සක්‍රිය' : 'අක්‍රිය' }}
              </span>
              <span class="date-chip">{{
                u.createdAt | date: 'yyyy-MM-dd'
              }}</span>
            </div>
          </div>
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
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && users.length === 0"
      icon="people"
      title="පරිශීලකයින් නොමැත"
      message="තවම පරිශීලකයින් නොමැත."
    ></app-empty-state>

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
      .user-main {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .user-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0b3d91, #1565c0);
        color: #fff;
        font-weight: 700;
        font-size: 15px;
        flex-shrink: 0;
      }
      .user-info {
        flex: 1;
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
      .user-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      .status-chip {
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
      .date-chip {
        font-size: 11px;
        color: #999;
        padding: 2px 8px;
        background: #f5f5f5;
        border-radius: 4px;
      }
    `,
  ],
})
export class SuperadminUsersComponent implements OnInit {
  users: UserDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 30;
  totalElements = 0;

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
    this.api.superGetUsers(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
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
        this.api.superDeleteUser(u.id).subscribe({
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
