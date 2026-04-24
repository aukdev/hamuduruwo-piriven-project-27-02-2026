import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ContactMessageDetailDialogComponent } from '../../../shared/components/contact-message-detail-dialog/contact-message-detail-dialog.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ContactMessageDto } from '../../../core/models';

@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './contact-management.component.html',
  styleUrls: ['./contact-management.component.scss'],
})
export class ContactManagementComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  messages: ContactMessageDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  unreadCount = 0;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getContactMessages(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.messages = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.refreshUnread();
  }

  refreshUnread(): void {
    this.api.getUnreadContactCount().subscribe({
      next: (res) => (this.unreadCount = res.unread),
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.load();
  }

  viewMessage(m: ContactMessageDto): void {
    const ref = this.dialog.open(ContactMessageDetailDialogComponent, {
      data: m,
      width: '600px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe(() => {
      if (!m.isRead) {
        this.api.markContactMessageRead(m.id, true).subscribe({
          next: (updated) => {
            const idx = this.messages.findIndex((x) => x.id === m.id);
            if (idx >= 0) this.messages[idx] = updated;
            this.refreshUnread();
          },
        });
      }
    });
  }

  toggleRead(m: ContactMessageDto, event: Event): void {
    event.stopPropagation();
    const next = !m.isRead;
    this.api.markContactMessageRead(m.id, next).subscribe({
      next: (updated) => {
        const idx = this.messages.findIndex((x) => x.id === m.id);
        if (idx >= 0) this.messages[idx] = updated;
        this.refreshUnread();
        this.notify.success(
          updated.isRead
            ? 'කියවූ ලෙස සලකුණු කරන ලදී'
            : 'නොකියවූ ලෙස සලකුණු කරන ලදී',
        );
      },
      error: (err) =>
        this.notify.error(err.error?.message || 'ක්‍රියාව අසාර්ථකයි'),
    });
  }

  deleteMessage(m: ContactMessageDto, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පණිවිඩය මකා දැමීම',
        message: `"${m.name}" ගෙන් ලැබුණු පණිවිඩය ස්ථිරවම මකා දැමීමට අවශ්‍යද?`,
        confirmText: 'මකන්න',
        dangerous: true,
      },
      width: '420px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deleteContactMessage(m.id).subscribe({
          next: () => {
            this.notify.success('පණිවිඩය මකා දමන ලදී');
            this.load();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි'),
        });
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getSnippet(message: string, max = 120): string {
    if (!message) return '';
    return message.length > max ? message.substring(0, max) + '…' : message;
  }
}
