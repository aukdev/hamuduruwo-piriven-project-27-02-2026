import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestionDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent implements OnInit {
  questions: QuestionDto[] = [];
  filteredQuestions: QuestionDto[] = [];
  loading = true;
  currentFilter = 'ALL';

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.api.getMyQuestions(0, 200).subscribe({
      next: (res) => {
        this.questions = res.content;
        this.applyFilter();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterByStatus(index: number): void {
    const statuses = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'];
    this.currentFilter = statuses[index];
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.currentFilter === 'ALL') {
      this.filteredQuestions = this.questions;
    } else {
      this.filteredQuestions = this.questions.filter(
        (q) => q.status === this.currentFilter,
      );
    }
  }

  getCount(status: string): number {
    return this.questions.filter((q) => q.status === status).length;
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      DRAFT: 'කෙටුම්පත',
      PENDING_REVIEW: 'සමාලෝචනයට',
      APPROVED: 'අනුමත',
      REJECTED: 'ප්‍රතික්ෂේප',
    };
    return map[status] || status;
  }

  viewQuestion(q: QuestionDto): void {
    this.router.navigate(['/teacher/questions', q.id]);
  }

  editQuestion(q: QuestionDto, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/teacher/questions/edit', q.id]);
  }

  submitForReview(q: QuestionDto, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'සමාලෝචනයට ඉදිරිපත් කරන්න',
        message:
          'මෙම ප්‍රශ්නය සමාලෝචනය සඳහා ඉදිරිපත් කිරීමට අවශ්‍යද? ඉදිරිපත් කළ පසු සංස්කරණය කළ නොහැක.',
        confirmText: 'ඉදිරිපත් කරන්න',
      },
      width: '400px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.submitQuestion(q.id).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය සමාලෝචනයට ඉදිරිපත් කරන ලදී!');
            this.loadQuestions();
          },
          error: (err) => {
            this.notify.error(
              err.error?.message || 'ඉදිරිපත් කිරීම අසාර්ථකයි.',
            );
          },
        });
      }
    });
  }
}
