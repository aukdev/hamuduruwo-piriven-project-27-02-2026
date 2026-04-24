import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto, SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-teacher-papers',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './teacher-papers.component.html',
  styleUrls: ['./teacher-papers.component.scss'],
})
export class TeacherPapersComponent implements OnInit {
  papers: PaperDto[] = [];
  filteredPapers: PaperDto[] = [];
  subjects: SubjectDto[] = [];
  loading = true;
  saving = false;
  showCreateForm = false;
  editingPaper: PaperDto | null = null;
  selectedSubject = 'ALL';
  yearOptions: number[] = [];

  createForm!: FormGroup;
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= 2017; y--) {
      this.yearOptions.push(y);
    }

    this.createForm = this.fb.group({
      subjectId: ['', Validators.required],
      year: [currentYear, Validators.required],
      questionCount: [
        40,
        [Validators.required, Validators.min(1), Validators.max(200)],
      ],
      durationMinutes: [20, [Validators.required, Validators.min(1)]],
    });

    this.editForm = this.fb.group({
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
    this.api.getTeacherPapers().subscribe({
      next: (papers) => {
        this.papers = papers;
        this.applyFilter();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterBySubject(value: string): void {
    this.selectedSubject = value;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedSubject === 'ALL') {
      this.filteredPapers = this.papers;
    } else {
      this.filteredPapers = this.papers.filter(
        (p) => p.subjectId === this.selectedSubject,
      );
    }
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingPaper = null;
  }

  createPaper(): void {
    if (this.createForm.invalid) return;
    this.saving = true;
    const val = this.createForm.value;
    this.api
      .createTeacherPaper({
        subjectId: val.subjectId,
        year: val.year,
        questionCount: val.questionCount,
        durationSeconds: val.durationMinutes * 60,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.showCreateForm = false;
          this.notify.success('ප්‍රශ්න පත්‍රය සාර්ථකව සාදන ලදී!');
          this.loadPapers();
        },
        error: (err) => {
          this.saving = false;
          this.notify.error(err.error?.message || 'සෑදීම අසාර්ථකයි.');
        },
      });
  }

  editPaper(p: PaperDto): void {
    this.editingPaper = p;
    this.showCreateForm = false;
    this.editForm.patchValue({
      questionCount: p.questionCount,
      durationMinutes: p.durationSeconds / 60,
    });
  }

  updatePaper(): void {
    if (!this.editingPaper || this.editForm.invalid) return;
    this.saving = true;
    const val = this.editForm.value;
    this.api
      .updateTeacherPaper(this.editingPaper.id, {
        questionCount: val.questionCount,
        durationSeconds: val.durationMinutes * 60,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.editingPaper = null;
          this.notify.success('ප්‍රශ්න පත්‍රය යාවත්කාලීන කරන ලදී!');
          this.loadPapers();
        },
        error: (err) => {
          this.saving = false;
          this.notify.error(err.error?.message || 'යාවත්කාලීන අසාර්ථකයි.');
        },
      });
  }
}
