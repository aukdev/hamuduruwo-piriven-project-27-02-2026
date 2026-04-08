import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditTestimonialDialogComponent } from '../../../shared/components/edit-testimonial-dialog/edit-testimonial-dialog.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  TestimonialDto,
  UserDto,
  UpdateTestimonialRequest,
} from '../../../core/models';

@Component({
  selector: 'app-testimonial-management',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './testimonial-management.component.html',
  styleUrls: ['./testimonial-management.component.scss'],
})
export class TestimonialManagementComponent implements OnInit {
  /* Tab 1: Submitted testimonials */
  testimonials: TestimonialDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;

  /* Tab 2: Enable feedback */
  allUsers: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  enabledUsers: TestimonialDto[] = [];
  userSearchQuery = '';
  usersLoading = false;
  enabledLoading = false;

  currentTab = 0;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadTestimonials();
  }

  onTabChange(index: number): void {
    this.currentTab = index;
    if (index === 1 && this.allUsers.length === 0) {
      this.loadAllUsers();
      this.loadEnabledUsers();
    }
  }

  /* ── Tab 1: Manage Testimonials ── */

  loadTestimonials(): void {
    this.loading = true;
    this.api
      .getSubmittedTestimonials(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.testimonials = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadTestimonials();
  }

  togglePublish(t: TestimonialDto): void {
    this.api.toggleTestimonialPublish(t.id).subscribe({
      next: (updated) => {
        const idx = this.testimonials.findIndex((x) => x.id === t.id);
        if (idx >= 0) this.testimonials[idx] = updated;
        this.notify.success(
          updated.isPublished ? 'ප්‍රකාශිත කරන ලදී' : 'ප්‍රකාශය ඉවත් කරන ලදී',
        );
      },
      error: (err) =>
        this.notify.error(err.error?.message || 'ක්‍රියාව අසාර්ථකයි'),
    });
  }

  editTestimonial(t: TestimonialDto): void {
    const ref = this.dialog.open(EditTestimonialDialogComponent, {
      data: t,
      width: '500px',
    });
    ref
      .afterClosed()
      .subscribe((result: UpdateTestimonialRequest | undefined) => {
        if (result) {
          this.api.updateTestimonial(t.id, result).subscribe({
            next: () => {
              this.notify.success('අදහස යාවත්කාලීන කරන ලදී');
              this.loadTestimonials();
            },
            error: (err) =>
              this.notify.error(
                err.error?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි',
              ),
          });
        }
      });
  }

  deleteTestimonial(t: TestimonialDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'අදහස මකා දැමීම',
        message: `"${t.userName}" ගේ අදහස ස්ථිරවම මකා දැමීමට අවශ්‍යද?`,
        confirmText: 'මකන්න',
        dangerous: true,
      },
      width: '420px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deleteTestimonial(t.id).subscribe({
          next: () => {
            this.notify.success('අදහස මකා දමන ලදී');
            this.loadTestimonials();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි'),
        });
      }
    });
  }

  getPhotoUrl(t: TestimonialDto): string {
    return this.api.getTestimonialPhotoUrl(t.id);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating || 0 }, (_, i) => i);
  }

  getEmptyStars(rating: number): number[] {
    return Array.from({ length: 5 - (rating || 0) }, (_, i) => i);
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /* ── Tab 2: Enable Feedback ── */

  loadAllUsers(): void {
    this.usersLoading = true;
    this.api.getUsers(0, 200).subscribe({
      next: (res) => {
        this.allUsers = res.content.filter(
          (u) => u.role === 'TEACHER' || u.role === 'STUDENT',
        );
        this.filteredUsers = this.allUsers;
        this.usersLoading = false;
      },
      error: () => (this.usersLoading = false),
    });
  }

  loadEnabledUsers(): void {
    this.enabledLoading = true;
    this.api.getFormEnabledUsers().subscribe({
      next: (data) => {
        this.enabledUsers = data;
        this.enabledLoading = false;
      },
      error: () => (this.enabledLoading = false),
    });
  }

  filterUsers(): void {
    const q = this.userSearchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredUsers = this.allUsers;
      return;
    }
    this.filteredUsers = this.allUsers.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }

  isFormEnabled(userId: string): boolean {
    return this.enabledUsers.some((e) => e.userId === userId);
  }

  enableForm(user: UserDto): void {
    this.api.enableTestimonialForm(user.id).subscribe({
      next: () => {
        this.notify.success(`${user.fullName} සඳහා form එක enable කරන ලදී`);
        this.loadEnabledUsers();
      },
      error: (err) =>
        this.notify.error(err.error?.message || 'Enable කිරීම අසාර්ථකයි'),
    });
  }

  disableForm(t: TestimonialDto): void {
    this.api.disableTestimonialForm(t.userId).subscribe({
      next: () => {
        this.notify.success(`${t.userName} සඳහා form එක disable කරන ලදී`);
        this.loadEnabledUsers();
      },
      error: (err) =>
        this.notify.error(err.error?.message || 'Disable කිරීම අසාර්ථකයි'),
    });
  }
}
