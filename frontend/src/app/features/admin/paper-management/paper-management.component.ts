import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-paper-management',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './paper-management.component.html',
  styleUrls: ['./paper-management.component.scss'],
})
export class PaperManagementComponent implements OnInit {
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

  /* Create Paper */
  showCreateDialog = false;
  creatingPaper = false;
  createForm: FormGroup;

  /* Question Form */
  showQuestionForm = false;
  submittingQuestion = false;
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
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

    this.questionForm = this.fb.group({
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

  get optionControls(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  ngOnInit(): void {
    this.api.getYears().subscribe({
      next: (y) => (this.years = y.sort((a, b) => b - a)),
      error: () => {},
    });
    this.api.getSubjects().subscribe({
      next: (s) => (this.subjects = s),
      error: () => {},
    });
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

  openPaperDetail(paperId: string): void {
    this.selectedPaperId = paperId;
    this.loadingDetail = true;
    this.showQuestionForm = false;
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
    // Refresh papers list
    if (this.selectedYear) {
      this.onYearChange();
    }
  }

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
        // Refresh years and select this year
        this.selectedYear = paper.year;
        this.api.getYears().subscribe({
          next: (y) => (this.years = y.sort((a, b) => b - a)),
        });
        this.onYearChange();
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'සෑදීම අසාර්ථකයි.');
        this.creatingPaper = false;
      },
    });
  }

  submitQuestion(): void {
    if (this.questionForm.invalid || !this.selectedPaperId) return;

    // Validate exactly one correct answer
    const options = this.questionForm.value.options;
    const correctCount = options.filter((o: any) => o.isCorrect).length;
    if (correctCount !== 1) {
      this.notify.error('නිවැරදි පිළිතුරක් එකක් පමණක් තෝරන්න.');
      return;
    }

    this.submittingQuestion = true;
    this.api
      .createQuestionForPaper(this.selectedPaperId, this.questionForm.value)
      .subscribe({
        next: (detail) => {
          this.notify.success('ප්‍රශ්නය සාර්ථකව එක් කරන ලදී!');
          this.paperDetail = detail;
          this.showQuestionForm = false;
          this.submittingQuestion = false;
          this.resetQuestionForm();
        },
        error: (err) => {
          this.notify.error(
            err.error?.message || 'ප්‍රශ්නය එක් කිරීම අසාර්ථකයි.',
          );
          this.submittingQuestion = false;
        },
      });
  }

  removeQuestion(questionId: string): void {
    if (!this.selectedPaperId) return;
    this.api
      .removeQuestionFromPaper(this.selectedPaperId, questionId)
      .subscribe({
        next: () => {
          this.notify.success('ප්‍රශ්නය ඉවත් කරන ලදී.');
          this.openPaperDetail(this.selectedPaperId!);
        },
        error: (err) => {
          this.notify.error(err.error?.message || 'ඉවත් කිරීම අසාර්ථකයි.');
        },
      });
  }

  private resetQuestionForm(): void {
    this.questionForm.reset();
    const opts = this.optionControls;
    for (let i = 0; i < 4; i++) {
      opts.at(i).patchValue({
        optionText: '',
        isCorrect: i === 0,
        optionOrder: i + 1,
      });
    }
  }
}
