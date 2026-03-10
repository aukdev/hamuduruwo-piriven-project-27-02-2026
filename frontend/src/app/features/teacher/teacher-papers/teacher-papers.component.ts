import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto, SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-teacher-papers',
  template: `
    <app-page-header
      title="මගේ ප්‍රශ්න පත්‍ර"
      subtitle="ඔබට පවරන ලද විෂයන් වල ප්‍රශ්න පත්‍ර කළමනාකරණය"
    >
      <button mat-flat-button color="primary" (click)="openCreateForm()">
        <mat-icon>add</mat-icon> නව ප්‍රශ්න පත්‍රයක්
      </button>
    </app-page-header>

    <!-- Create Form -->
    <mat-card class="form-card mb-20" *ngIf="showCreateForm">
      <h3 class="card-title">
        <mat-icon>add_circle</mat-icon> නව ප්‍රශ්න පත්‍රයක් සාදන්න
        <button
          mat-icon-button
          (click)="showCreateForm = false"
          class="ml-auto"
        >
          <mat-icon>close</mat-icon>
        </button>
      </h3>
      <form [formGroup]="createForm" (ngSubmit)="createPaper()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>විෂය</mat-label>
            <mat-select formControlName="subjectId">
              <mat-option *ngFor="let s of subjects" [value]="s.id">{{
                s.name
              }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>අවුරුද්ද</mat-label>
            <mat-select formControlName="year">
              <mat-option *ngFor="let y of yearOptions" [value]="y">{{
                y
              }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>ප්‍රශ්න ගණන</mat-label>
            <input
              matInput
              type="number"
              formControlName="questionCount"
              min="1"
              max="200"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>කාලය (මිනිත්තු)</mat-label>
            <input
              matInput
              type="number"
              formControlName="durationMinutes"
              min="1"
            />
          </mat-form-field>
        </div>

        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="createForm.invalid || saving"
        >
          <mat-icon>save</mat-icon> සාදන්න
        </button>
      </form>
    </mat-card>

    <!-- Edit Form -->
    <mat-card class="form-card mb-20" *ngIf="editingPaper">
      <h3 class="card-title">
        <mat-icon>edit</mat-icon>
        {{ editingPaper.subjectName }} - {{ editingPaper.year }} සංස්කරණය
        <button mat-icon-button (click)="editingPaper = null" class="ml-auto">
          <mat-icon>close</mat-icon>
        </button>
      </h3>
      <form [formGroup]="editForm" (ngSubmit)="updatePaper()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>ප්‍රශ්න ගණන</mat-label>
            <input
              matInput
              type="number"
              formControlName="questionCount"
              min="1"
              max="200"
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>කාලය (මිනිත්තු)</mat-label>
            <input
              matInput
              type="number"
              formControlName="durationMinutes"
              min="1"
            />
          </mat-form-field>
        </div>

        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="editForm.invalid || saving"
        >
          <mat-icon>save</mat-icon> යාවත්කාලීන
        </button>
      </form>
    </mat-card>

    <!-- Subject Filter -->
    <div class="filter-bar mb-16" *ngIf="subjects.length > 1">
      <mat-chip-listbox (change)="filterBySubject($event.value)">
        <mat-chip-option [value]="'ALL'" [selected]="selectedSubject === 'ALL'"
          >සියල්ලම</mat-chip-option
        >
        <mat-chip-option
          *ngFor="let s of subjects"
          [value]="s.id"
          [selected]="selectedSubject === s.id"
          >{{ s.name }}</mat-chip-option
        >
      </mat-chip-listbox>
    </div>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <!-- Papers List -->
    <div class="papers-grid" *ngIf="!loading">
      <mat-card class="paper-card" *ngFor="let p of filteredPapers">
        <div class="paper-card__header">
          <span class="paper-year">{{ p.year }}</span>
          <span class="paper-subject">{{ p.subjectName }}</span>
        </div>

        <div class="paper-card__stats">
          <div class="stat">
            <span class="stat-label">ප්‍රශ්න</span>
            <span class="stat-value"
              >{{ p.assignedQuestions }} / {{ p.questionCount }}</span
            >
          </div>
          <div class="stat">
            <span class="stat-label">කාලය</span>
            <span class="stat-value">{{ p.durationSeconds / 60 }} මි.</span>
          </div>
        </div>

        <mat-progress-bar
          mode="determinate"
          [value]="
            p.questionCount > 0
              ? (p.assignedQuestions / p.questionCount) * 100
              : 0
          "
          [color]="
            p.assignedQuestions >= p.questionCount ? 'primary' : 'accent'
          "
        ></mat-progress-bar>

        <div class="paper-card__actions">
          <button
            mat-stroked-button
            [routerLink]="['/teacher/questions/create']"
            [queryParams]="{ paperId: p.id }"
          >
            <mat-icon>add</mat-icon> ප්‍රශ්නයක් එකතු
          </button>
          <button mat-icon-button matTooltip="සංස්කරණය" (click)="editPaper(p)">
            <mat-icon>settings</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && filteredPapers.length === 0"
      icon="description"
      title="ප්‍රශ්න පත්‍ර නොමැත"
      message="ඔබට පවරන ලද විෂයන් වල ප්‍රශ්න පත්‍ර නොමැත."
    ></app-empty-state>
  `,
  styles: [
    `
      .form-card {
        padding: 24px !important;
      }
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: #0b3d91;
        margin: 0 0 16px;
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
      .ml-auto {
        margin-left: auto;
      }
      .form-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        mat-form-field {
          flex: 1;
          min-width: 180px;
        }
      }
      .filter-bar {
        display: flex;
        gap: 8px;
      }
      .papers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
      }
      .paper-card {
        padding: 20px !important;
      }
      .paper-card__header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
      }
      .paper-year {
        font-size: 22px;
        font-weight: 800;
        color: #0b3d91;
      }
      .paper-subject {
        font-size: 13px;
        font-weight: 600;
        color: #2e7d32;
        background: rgba(46, 125, 50, 0.08);
        padding: 3px 10px;
        border-radius: 6px;
      }
      .paper-card__stats {
        display: flex;
        gap: 24px;
        margin-bottom: 12px;
      }
      .stat {
        display: flex;
        flex-direction: column;
      }
      .stat-label {
        font-size: 11px;
        color: #888;
        text-transform: uppercase;
      }
      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: #333;
      }
      mat-progress-bar {
        margin-bottom: 16px;
        border-radius: 4px;
      }
      .paper-card__actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      @media (max-width: 600px) {
        .papers-grid {
          grid-template-columns: 1fr;
        }
        .form-row {
          flex-direction: column;
        }
      }
    `,
  ],
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
