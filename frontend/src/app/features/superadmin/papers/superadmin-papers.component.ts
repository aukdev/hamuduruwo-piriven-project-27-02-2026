import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  PaperDto,
  PaperDetailDto,
  SubjectDto,
  PaperQuestionInfo,
} from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-superadmin-papers',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './superadmin-papers.component.html',
  styleUrls: ['./superadmin-papers.component.scss'],
})
export class SuperadminPapersComponent implements OnInit {
  years: number[] = [];
  papers: PaperDto[] = [];
  subjects: SubjectDto[] = [];
  selectedYear: number | null = null;
  paperDetail: PaperDetailDto | null = null;
  selectedPaperId: string | null = null;
  loadingPapers = false;
  loadingDetail = false;

  displayedColumns = [
    'subjectName',
    'year',
    'questionCount',
    'progress',
    'duration',
    'actions',
  ];

  showCreateDialog = false;
  creatingPaper = false;
  createForm: FormGroup;

  showEditDialog = false;
  updatingPaper = false;
  editingPaperId: string | null = null;
  editForm: FormGroup;

  showQuestionForm = false;
  submittingQuestion = false;
  editingQuestionId: string | null = null;
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {
    this.createForm = this.fb.group({
      year: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(2000), Validators.max(2100)],
      ],
      subjectId: ['', Validators.required],
      questionCount: [
        40,
        [Validators.required, Validators.min(1), Validators.max(200)],
      ],
      durationSeconds: [1200, [Validators.required, Validators.min(60)]],
    });

    this.editForm = this.fb.group({
      questionCount: [
        40,
        [Validators.required, Validators.min(1), Validators.max(200)],
      ],
      durationSeconds: [1200, [Validators.required, Validators.min(60)]],
    });

    this.questionForm = this.buildQuestionForm();
  }

  get optionControls(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  ngOnInit(): void {
    this.api
      .getYears()
      .subscribe({ next: (y) => (this.years = y.sort((a, b) => b - a)) });
    this.api.getSubjects().subscribe({ next: (s) => (this.subjects = s) });
  }

  onYearChange(): void {
    if (!this.selectedYear) return;
    this.paperDetail = null;
    this.selectedPaperId = null;
    this.loadingPapers = true;
    this.api.getPapersByYear(this.selectedYear).subscribe({
      next: (p) => {
        this.papers = p;
        this.loadingPapers = false;
      },
      error: () => {
        this.papers = [];
        this.loadingPapers = false;
      },
    });
  }

  /* ── Paper Detail ── */

  openPaperDetail(paperId: string): void {
    this.selectedPaperId = paperId;
    this.loadingDetail = true;
    this.showQuestionForm = false;
    this.editingQuestionId = null;
    this.api.getPaperDetail(paperId).subscribe({
      next: (d) => {
        this.paperDetail = d;
        this.loadingDetail = false;
      },
      error: () => (this.loadingDetail = false),
    });
  }

  closePaperDetail(): void {
    this.paperDetail = null;
    this.selectedPaperId = null;
    this.showQuestionForm = false;
    this.editingQuestionId = null;
    if (this.selectedYear) this.onYearChange();
  }

  /* ── Create Paper ── */

  createPaper(): void {
    if (this.createForm.invalid) return;
    this.creatingPaper = true;
    this.api.createPaper(this.createForm.value).subscribe({
      next: (paper) => {
        this.notify.success('ප්‍රශ්න පත්‍රය සාර්ථකව සාදන ලදී!');
        this.showCreateDialog = false;
        this.creatingPaper = false;
        this.createForm.reset({
          year: new Date().getFullYear(),
          subjectId: '',
          questionCount: 40,
          durationSeconds: 1200,
        });
        this.selectedYear = paper.year;
        this.api
          .getYears()
          .subscribe({ next: (y) => (this.years = y.sort((a, b) => b - a)) });
        this.onYearChange();
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'සෑදීම අසාර්ථකයි.');
        this.creatingPaper = false;
      },
    });
  }

  /* ── Edit Paper ── */

  openEditPaper(paper: PaperDto): void {
    this.editingPaperId = paper.id;
    this.editForm.patchValue({
      questionCount: paper.questionCount,
      durationSeconds: paper.durationSeconds,
    });
    this.showEditDialog = true;
  }

  openEditPaperFromDetail(): void {
    if (!this.paperDetail || !this.selectedPaperId) return;
    this.editingPaperId = this.selectedPaperId;
    this.editForm.patchValue({
      questionCount: this.paperDetail.questionCount,
      durationSeconds: this.paperDetail.durationSeconds,
    });
    this.showEditDialog = true;
  }

  updatePaper(): void {
    if (this.editForm.invalid || !this.editingPaperId) return;
    this.updatingPaper = true;
    this.api.updatePaper(this.editingPaperId, this.editForm.value).subscribe({
      next: () => {
        this.notify.success('පත්‍රය යාවත්කාලීන කරන ලදී!');
        this.showEditDialog = false;
        this.updatingPaper = false;
        this.editingPaperId = null;
        if (this.selectedPaperId) {
          this.openPaperDetail(this.selectedPaperId);
        }
        if (this.selectedYear) this.onYearChange();
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'යාවත්කාලීන අසාර්ථකයි.');
        this.updatingPaper = false;
      },
    });
  }

  /* ── Delete Paper ── */

  confirmDeletePaper(paper: PaperDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පත්‍රය මකා දැමීම',
        message: `${paper.year} - ${paper.subjectName} පත්‍රය ස්ථිරවම මකා දැමීමට අවශ්‍යද? මෙම පත්‍රයට අදාළ සියලුම දත්ත මැකෙනු ඇත.`,
        confirmText: 'මකා දමන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.deletePaper(paper.id).subscribe({
          next: () => {
            this.notify.success('පත්‍රය මකා දමන ලදී.');
            this.api.getYears().subscribe({
              next: (y) => (this.years = y.sort((a, b) => b - a)),
            });
            if (this.selectedYear) this.onYearChange();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
  }

  /* ── Create Question ── */

  openCreateQuestionForm(): void {
    this.editingQuestionId = null;
    this.questionForm = this.buildQuestionForm();
    this.showQuestionForm = true;
  }

  submitQuestion(): void {
    if (this.questionForm.invalid || !this.selectedPaperId) return;
    const options = this.questionForm.value.options;
    const correctCount = options.filter((o: any) => o.isCorrect).length;
    if (correctCount !== 1) {
      this.notify.error('නිවැරදි පිළිතුරක් එකක් පමණක් තෝරන්න.');
      return;
    }

    if (this.editingQuestionId) {
      this.updateQuestion();
    } else {
      this.createNewQuestion();
    }
  }

  private createNewQuestion(): void {
    this.submittingQuestion = true;
    this.api
      .createQuestionForPaper(this.selectedPaperId!, this.questionForm.value)
      .subscribe({
        next: (detail) => {
          this.notify.success('ප්‍රශ්නය සාර්ථකව එක් කරන ලදී!');
          this.paperDetail = detail;
          this.showQuestionForm = false;
          this.submittingQuestion = false;
          this.questionForm = this.buildQuestionForm();
        },
        error: (err) => {
          this.notify.error(
            err.error?.message || 'ප්‍රශ්නය එක් කිරීම අසාර්ථකයි.',
          );
          this.submittingQuestion = false;
        },
      });
  }

  /* ── Edit Question ── */

  openEditQuestion(pq: PaperQuestionInfo): void {
    this.editingQuestionId = pq.questionId;
    this.questionForm = this.buildQuestionForm();
    this.questionForm.patchValue({ questionText: pq.questionText });
    if (pq.options) {
      pq.options.forEach((opt, i) => {
        if (this.optionControls.at(i)) {
          this.optionControls.at(i).patchValue({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            optionOrder: opt.optionOrder,
          });
        }
      });
    }
    this.showQuestionForm = true;
  }

  private updateQuestion(): void {
    if (!this.editingQuestionId) return;
    this.submittingQuestion = true;
    const val = this.questionForm.value;
    this.api
      .superUpdateQuestion(this.editingQuestionId, {
        questionText: val.questionText,
        options: val.options,
      })
      .subscribe({
        next: () => {
          this.notify.success('ප්‍රශ්නය යාවත්කාලීන කරන ලදී!');
          this.showQuestionForm = false;
          this.editingQuestionId = null;
          this.submittingQuestion = false;
          this.openPaperDetail(this.selectedPaperId!);
        },
        error: (err) => {
          this.notify.error(
            err.error?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි.',
          );
          this.submittingQuestion = false;
        },
      });
  }

  cancelQuestionForm(): void {
    this.showQuestionForm = false;
    this.editingQuestionId = null;
  }

  /* ── Remove Question from Paper ── */

  removeQuestion(questionId: string): void {
    if (!this.selectedPaperId) return;
    this.api
      .removeQuestionFromPaper(this.selectedPaperId, questionId)
      .subscribe({
        next: () => {
          this.notify.success('ප්‍රශ්නය පත්‍රයෙන් ඉවත් කරන ලදී.');
          this.openPaperDetail(this.selectedPaperId!);
        },
        error: (err) => {
          this.notify.error(err.error?.message || 'ඉවත් කිරීම අසාර්ථකයි.');
        },
      });
  }

  /* ── Delete Question Permanently ── */

  confirmDeleteQuestion(pq: PaperQuestionInfo): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය මකා දැමීම',
        message: `"${pq.questionText.substring(0, 60)}..." ප්‍රශ්නය ස්ථිරවම මකා දැමීමට අවශ්‍යද? මෙය ආපසු හැරවිය නොහැක.`,
        confirmText: 'මකා දමන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.superDeleteQuestion(pq.questionId).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය ස්ථිරවම මකා දමන ලදී.');
            this.openPaperDetail(this.selectedPaperId!);
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
  }

  /* ── Helpers ── */

  private buildQuestionForm(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      options: this.fb.array(
        [1, 2, 3, 4].map((i) =>
          this.fb.group({
            optionText: ['', Validators.required],
            isCorrect: [i === 1],
            optionOrder: [i],
          }),
        ),
      ),
    });
  }
}
