import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto, SubjectDto, PaperStatus } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-teacher-practice-papers',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './teacher-practice-papers.component.html',
  styleUrls: ['./teacher-practice-papers.component.scss'],
})
export class TeacherPracticePapersComponent implements OnInit {
  papers: PaperDto[] = [];
  subjects: SubjectDto[] = [];
  loading = true;
  saving = false;
  showCreateForm = false;

  createForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notify: NotificationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      subjectId: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      questionCount: [
        40,
        [Validators.required, Validators.min(1), Validators.max(200)],
      ],
      durationMinutes: [20, [Validators.required, Validators.min(1)]],
    });

    this.api.getMySubjects().subscribe((s) => (this.subjects = s));
    this.loadPapers();
  }

  loadPapers(): void {
    this.loading = true;
    this.api.getTeacherPracticePapers().subscribe({
      next: (res) => {
        this.papers = res.content;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  createPaper(): void {
    if (this.createForm.invalid) return;
    this.saving = true;
    const val = this.createForm.value;
    this.api
      .createPracticePaper({
        subjectId: val.subjectId,
        title: val.title,
        questionCount: val.questionCount,
        durationSeconds: val.durationMinutes * 60,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.showCreateForm = false;
          this.createForm.reset({ questionCount: 40, durationMinutes: 20 });
          this.notify.success('පුහුණු ප්‍රශ්න පත්‍රය සාර්ථකව සාදන ලදී!');
          this.loadPapers();
        },
        error: (err) => {
          this.saving = false;
          this.notify.error(err.error?.message || 'සෑදීම අසාර්ථකයි.');
        },
      });
  }

  submitForApproval(paper: PaperDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'අනුමතිය සඳහා ඉදිරිපත් කරන්න',
        message: `"${paper.title}" අනුමතිය සඳහා ඉදිරිපත් කිරීමට අවශ්‍යද?`,
        confirmText: 'ඉදිරිපත් කරන්න',
        cancelText: 'නැත',
      },
      width: '400px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.submitPracticePaperForApproval(paper.id).subscribe({
          next: () => {
            this.notify.success('අනුමතිය සඳහා ඉදිරිපත් කරන ලදී!');
            this.loadPapers();
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

  getStatusLabel(status: PaperStatus): string {
    switch (status) {
      case 'DRAFT':
        return 'කටු සටහන';
      case 'PENDING_APPROVAL':
        return 'අනුමතිය බලාපොරොත්තුයි';
      case 'APPROVED':
        return 'අනුමත කරන ලදී';
      case 'REJECTED':
        return 'ප්‍රතික්ෂේප විය';
      default:
        return status;
    }
  }

  getStatusColor(status: PaperStatus): string {
    switch (status) {
      case 'DRAFT':
        return 'default';
      case 'PENDING_APPROVAL':
        return 'accent';
      case 'APPROVED':
        return 'primary';
      case 'REJECTED':
        return 'warn';
      default:
        return 'default';
    }
  }

  canSubmit(paper: PaperDto): boolean {
    return (
      (paper.status === 'DRAFT' || paper.status === 'REJECTED') &&
      paper.assignedQuestions >= paper.questionCount
    );
  }

  canAddQuestions(paper: PaperDto): boolean {
    return paper.status === 'DRAFT' || paper.status === 'REJECTED';
  }
}
