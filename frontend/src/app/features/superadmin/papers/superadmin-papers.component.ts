import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  template: `
    <app-page-header
      title="පත්‍ර කළමනාකරණය"
      subtitle="විශය අනුව ප්‍රශ්න පත්‍ර කළමනාකරණය"
    >
      <button mat-flat-button color="primary" (click)="showCreateDialog = true">
        <mat-icon>add</mat-icon> නව පත්‍රයක් සාදන්න
      </button>
    </app-page-header>

    <!-- Year filter -->
    <mat-card class="filter-card mb-16">
      <div class="filter-row">
        <mat-form-field appearance="outline" class="year-select">
          <mat-label>වර්ෂය තෝරන්න</mat-label>
          <mat-select
            [(value)]="selectedYear"
            (selectionChange)="onYearChange()"
          >
            <mat-option *ngFor="let y of years" [value]="y">{{ y }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-card>

    <app-loading-overlay [show]="loadingPapers"></app-loading-overlay>

    <!-- Papers Table -->
    <mat-card
      class="table-card mb-16"
      *ngIf="!loadingPapers && papers.length > 0 && !paperDetail"
    >
      <table mat-table [dataSource]="papers" class="full-table">
        <ng-container matColumnDef="subjectName">
          <th mat-header-cell *matHeaderCellDef>විශය</th>
          <td mat-cell *matCellDef="let p">{{ p.subjectName }}</td>
        </ng-container>
        <ng-container matColumnDef="year">
          <th mat-header-cell *matHeaderCellDef>වර්ෂය</th>
          <td mat-cell *matCellDef="let p">{{ p.year }}</td>
        </ng-container>
        <ng-container matColumnDef="questionCount">
          <th mat-header-cell *matHeaderCellDef>ප්‍රශ්න ගණන</th>
          <td mat-cell *matCellDef="let p">{{ p.questionCount }}</td>
        </ng-container>
        <ng-container matColumnDef="progress">
          <th mat-header-cell *matHeaderCellDef>ප්‍රගතිය</th>
          <td mat-cell *matCellDef="let p">
            <div class="progress-cell">
              <span>{{ p.assignedQuestions }}/{{ p.questionCount }}</span>
              <mat-progress-bar
                mode="determinate"
                [value]="(p.assignedQuestions / p.questionCount) * 100"
              ></mat-progress-bar>
            </div>
          </td>
        </ng-container>
        <ng-container matColumnDef="duration">
          <th mat-header-cell *matHeaderCellDef>කාලය</th>
          <td mat-cell *matCellDef="let p">
            {{ p.durationSeconds / 60 }} මිනි.
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let p">
            <button
              mat-icon-button
              color="primary"
              matTooltip="විස්තර බලන්න"
              (click)="openPaperDetail(p.id)"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="සංස්කරණය"
              (click)="openEditPaper(p)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              matTooltip="මකා දැමීම"
              (click)="confirmDeletePaper(p)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </mat-card>

    <app-empty-state
      *ngIf="
        !loadingPapers && papers.length === 0 && selectedYear && !paperDetail
      "
      icon="description"
      title="පත්‍ර නොමැත"
      message="මෙම වර්ෂයට පත්‍ර තවම නොමැත. නව පත්‍රයක් සාදන්න."
    >
    </app-empty-state>

    <!-- ============ Paper Detail View ============ -->
    <div *ngIf="paperDetail && !loadingDetail">
      <mat-card class="detail-card mb-16">
        <div class="detail-header">
          <button mat-icon-button (click)="closePaperDetail()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h3 class="card-title">
            <mat-icon>assignment</mat-icon>
            {{ paperDetail.year }} - {{ paperDetail.subjectName }}
          </h3>
          <span class="detail-info">
            {{ paperDetail.durationSeconds / 60 }} මිනි. |
          </span>
          <span class="progress-label">
            {{ paperDetail.questions.length }}/{{ paperDetail.questionCount }}
            ප්‍රශ්න
          </span>
          <button
            mat-icon-button
            matTooltip="පත්‍රය සංස්කරණය"
            (click)="openEditPaperFromDetail()"
          >
            <mat-icon>settings</mat-icon>
          </button>
        </div>

        <mat-progress-bar
          mode="determinate"
          [value]="
            (paperDetail.questions.length / paperDetail.questionCount) * 100
          "
        ></mat-progress-bar>

        <div
          class="questions-list mt-16"
          *ngIf="paperDetail.questions.length > 0"
        >
          <div class="question-item" *ngFor="let pq of paperDetail.questions">
            <div class="question-item__header">
              <span class="position">#{{ pq.position }}</span>
              <span class="q-text">{{ pq.questionText }}</span>
              <button
                mat-icon-button
                matTooltip="සංස්කරණය"
                (click)="openEditQuestion(pq)"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                matTooltip="පත්‍රයෙන් ඉවත් කරන්න"
                (click)="removeQuestion(pq.questionId)"
              >
                <mat-icon>remove_circle_outline</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                matTooltip="ස්ථිරවම මකා දමන්න"
                (click)="confirmDeleteQuestion(pq)"
              >
                <mat-icon>delete_forever</mat-icon>
              </button>
            </div>
            <div class="options-grid" *ngIf="pq.options && pq.options.length">
              <div
                class="option-chip"
                *ngFor="let opt of pq.options"
                [class.correct]="opt.isCorrect"
              >
                <span class="opt-order">{{ opt.optionOrder }}</span>
                {{ opt.optionText }}
                <mat-icon *ngIf="opt.isCorrect" class="correct-icon"
                  >check_circle</mat-icon
                >
              </div>
            </div>
          </div>
        </div>

        <p *ngIf="paperDetail.questions.length === 0" class="text-muted mt-12">
          තවම ප්‍රශ්න පවරා නොමැත.
        </p>
      </mat-card>

      <!-- Add Question Button -->
      <div
        class="add-question-area mb-16"
        *ngIf="paperDetail.questions.length < paperDetail.questionCount"
      >
        <button
          mat-flat-button
          color="primary"
          (click)="openCreateQuestionForm()"
          *ngIf="!showQuestionForm"
        >
          <mat-icon>add_circle</mat-icon> නව ප්‍රශ්නයක් එක් කරන්න
        </button>
      </div>

      <!-- Inline Question Form (Create or Edit) -->
      <mat-card class="question-form-card" *ngIf="showQuestionForm">
        <h3 class="card-title">
          <mat-icon>{{ editingQuestionId ? 'edit' : 'add_circle' }}</mat-icon>
          {{ editingQuestionId ? 'ප්‍රශ්නය සංස්කරණය' : 'නව ප්‍රශ්නයක් සාදන්න' }}
        </h3>
        <form [formGroup]="questionForm" (ngSubmit)="submitQuestion()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ප්‍රශ්නය</mat-label>
            <textarea
              matInput
              formControlName="questionText"
              rows="3"
              placeholder="ප්‍රශ්නය ලියන්න..."
            ></textarea>
            <mat-error>ප්‍රශ්නය අවශ්‍යයි</mat-error>
          </mat-form-field>

          <div formArrayName="options" class="options-form">
            <div
              *ngFor="let opt of optionControls.controls; let i = index"
              [formGroupName]="i"
              class="option-row"
            >
              <span class="option-number">{{ i + 1 }}</span>
              <mat-form-field appearance="outline" class="option-field">
                <mat-label>පිළිතුර {{ i + 1 }}</mat-label>
                <input matInput formControlName="optionText" />
                <mat-error>පිළිතුර අවශ්‍යයි</mat-error>
              </mat-form-field>
              <mat-checkbox formControlName="isCorrect" color="primary">
                නිවැරදි
              </mat-checkbox>
            </div>
          </div>

          <div class="form-actions">
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="questionForm.invalid || submittingQuestion"
            >
              <mat-icon>save</mat-icon>
              {{ editingQuestionId ? 'යාවත්කාලීන' : 'සුරකින්න' }}
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="cancelQuestionForm()"
            >
              අවලංගු
            </button>
          </div>
        </form>
      </mat-card>
    </div>

    <!-- ============ Create Paper Dialog ============ -->
    <div
      class="modal-overlay"
      *ngIf="showCreateDialog"
      (click)="showCreateDialog = false"
    >
      <mat-card class="modal-card" (click)="$event.stopPropagation()">
        <h3 class="card-title">
          <mat-icon>note_add</mat-icon> නව ප්‍රශ්න පත්‍රයක් සාදන්න
        </h3>
        <form [formGroup]="createForm" (ngSubmit)="createPaper()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>වර්ෂය</mat-label>
            <input
              matInput
              type="number"
              formControlName="year"
              placeholder="2025"
            />
            <mat-error>2000-2100 අතර වර්ෂයක්</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>විශය</mat-label>
            <mat-select formControlName="subjectId">
              <mat-option *ngFor="let s of subjects" [value]="s.id">
                {{ s.name }}
              </mat-option>
            </mat-select>
            <mat-error>විශය තෝරන්න</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ප්‍රශ්න ගණන</mat-label>
            <input
              matInput
              type="number"
              formControlName="questionCount"
              placeholder="40"
            />
            <mat-error>1-200 අතර අංකයක්</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>කාලය (තත්පර)</mat-label>
            <input
              matInput
              type="number"
              formControlName="durationSeconds"
              placeholder="1200"
            />
            <mat-error>අවම 60 තත්පර</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="createForm.invalid || creatingPaper"
            >
              <mat-icon>add</mat-icon> සාදන්න
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="showCreateDialog = false"
            >
              අවලංගු
            </button>
          </div>
        </form>
      </mat-card>
    </div>

    <!-- ============ Edit Paper Dialog ============ -->
    <div
      class="modal-overlay"
      *ngIf="showEditDialog"
      (click)="showEditDialog = false"
    >
      <mat-card class="modal-card" (click)="$event.stopPropagation()">
        <h3 class="card-title"><mat-icon>edit</mat-icon> පත්‍රය සංස්කරණය</h3>
        <form [formGroup]="editForm" (ngSubmit)="updatePaper()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ප්‍රශ්න ගණන</mat-label>
            <input matInput type="number" formControlName="questionCount" />
            <mat-error>1-200 අතර අංකයක්</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>කාලය (තත්පර)</mat-label>
            <input matInput type="number" formControlName="durationSeconds" />
            <mat-error>අවම 60 තත්පර</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="editForm.invalid || updatingPaper"
            >
              <mat-icon>save</mat-icon> යාවත්කාලීන
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="showEditDialog = false"
            >
              අවලංගු
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .filter-card {
        padding: 20px 24px !important;
      }
      .filter-row {
        display: flex;
        gap: 16px;
        align-items: center;
      }
      .year-select {
        min-width: 200px;
      }
      .table-card {
        padding: 0 !important;
        overflow: hidden;
      }
      .full-table {
        width: 100%;
      }
      .progress-cell {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;
        span {
          font-size: 12px;
          white-space: nowrap;
          min-width: 40px;
        }
        mat-progress-bar {
          flex: 1;
        }
      }
      .detail-card,
      .question-form-card {
        padding: 24px !important;
      }
      .detail-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
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
      .detail-header .card-title {
        margin: 0;
        flex: 1;
      }
      .progress-label {
        font-size: 13px;
        color: #666;
        font-weight: 400;
        white-space: nowrap;
      }
      .questions-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .question-item {
        padding: 12px 16px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e8e8e8;
      }
      .question-item__header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .position {
        font-weight: 700;
        color: #0b3d91;
        font-size: 14px;
        min-width: 30px;
      }
      .q-text {
        flex: 1;
        font-size: 13px;
        color: #333;
      }
      .options-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        margin-top: 8px;
        padding-left: 42px;
      }
      .option-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 6px;
        background: #fff;
        border: 1px solid #e0e0e0;
        font-size: 12px;
        color: #555;
      }
      .option-chip.correct {
        background: #e8f5e9;
        border-color: #a5d6a7;
        color: #2e7d32;
        font-weight: 600;
      }
      .opt-order {
        font-weight: 700;
        color: #999;
        min-width: 14px;
      }
      .correct-icon {
        font-size: 14px !important;
        width: 14px !important;
        height: 14px !important;
        margin-left: auto;
      }
      .add-question-area {
        text-align: center;
      }
      .full-width {
        width: 100%;
      }
      .options-form {
        margin-bottom: 16px;
      }
      .option-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 4px;
      }
      .option-number {
        font-weight: 700;
        color: #0b3d91;
        font-size: 16px;
        min-width: 20px;
        text-align: center;
      }
      .option-field {
        flex: 1;
      }
      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-card {
        width: 480px;
        max-width: 90vw;
        padding: 28px !important;
      }
    `,
  ],
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
