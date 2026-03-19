import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestionDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-superadmin-approvals',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './superadmin-approvals.component.html',
  styleUrls: ['./superadmin-approvals.component.scss'],
})
export class SuperadminApprovalsComponent implements OnInit {
  questions: QuestionDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.api.getPendingQuestions(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.questions = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadQuestions();
  }

  approve(q: QuestionDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය අනුමත කරන්න',
        message: `"${q.questionText.substring(0, 80)}..." ප්‍රශ්නය අනුමත කිරීමට අවශ්‍යද?`,
        confirmText: 'අනුමත කරන්න',
      },
      width: '420px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.approveQuestion(q.id).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය සාර්ථකව අනුමත කරන ලදී!');
            this.loadQuestions();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'අනුමත කිරීම අසාර්ථකයි.'),
        });
      }
    });
  }

  reject(q: QuestionDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය ප්‍රතික්ෂේප කරන්න',
        message: 'ප්‍රතික්ෂේප කිරීමේ හේතුව ඇතුළත් කරන්න:',
        confirmText: 'ප්‍රතික්ෂේප කරන්න',
        dangerous: true,
        showInput: true,
        inputLabel: 'හේතුව',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result && result.inputValue) {
        this.api.rejectQuestion(q.id, { reason: result.inputValue }).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය ප්‍රතික්ෂේප කරන ලදී.');
            this.loadQuestions();
          },
          error: (err) =>
            this.notify.error(
              err.error?.message || 'ප්‍රතික්ෂේප කිරීම අසාර්ථකයි.',
            ),
        });
      }
    });
  }
}
