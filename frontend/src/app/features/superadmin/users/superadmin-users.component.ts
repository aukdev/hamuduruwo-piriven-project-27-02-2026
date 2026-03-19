import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
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

/* ────────── Main Users Component ────────── */
@Component({
  selector: 'app-superadmin-users',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    LoadingOverlayComponent,
    EmptyStateComponent,
  ],
  templateUrl: './superadmin-users.component.html',
  styleUrls: ['./superadmin-users.component.scss'],
})
export class SuperadminUsersComponent implements OnInit {
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
