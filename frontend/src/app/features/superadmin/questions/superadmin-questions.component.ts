import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestionDto, SubjectDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-superadmin-questions',
  template: `
    <app-page-header
      title="ප්‍රශ්න කළමනාකරණය (සම්පූර්ණ)"
      subtitle="සියලුම ප්‍රශ්න සෑදීම, සංස්කරණය, මකා දැමීම"
    >
    </app-page-header>

    <!-- Create / Edit Form Toggle -->
    <mat-card class="form-card mb-20" *ngIf="showForm">
      <h3 class="card-title">
        <mat-icon>{{ editingId ? 'edit' : 'add_circle' }}</mat-icon>
        {{ editingId ? 'ප්‍රශ්නය සංස්කරණය' : 'නව ප්‍රශ්නයක් සාදන්න' }}
        <button mat-icon-button (click)="cancelForm()" class="ml-auto">
          <mat-icon>close</mat-icon>
        </button>
      </h3>
      <form [formGroup]="questionForm" (ngSubmit)="saveQuestion()">
        <mat-form-field
          appearance="outline"
          class="full-width"
          *ngIf="!editingId"
        >
          <mat-label>විෂයය</mat-label>
          <mat-select formControlName="subjectId">
            <mat-option *ngFor="let s of subjects" [value]="s.id">{{
              s.name
            }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field
          appearance="outline"
          class="full-width"
          *ngIf="!editingId"
        >
          <mat-label>අවුරුද්ද</mat-label>
          <mat-select formControlName="year">
            <mat-option *ngFor="let y of yearOptions" [value]="y">{{
              y
            }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ප්‍රශ්නය</mat-label>
          <textarea matInput formControlName="questionText" rows="3"></textarea>
        </mat-form-field>

        <div formArrayName="options" class="options-form">
          <div
            *ngFor="let opt of optionsArray.controls; let i = index"
            [formGroupName]="i"
            class="option-row"
          >
            <span class="option-label">{{ ['A', 'B', 'C', 'D'][i] }}</span>
            <mat-form-field appearance="outline" class="flex-grow">
              <input
                matInput
                formControlName="optionText"
                placeholder="පිළිතුර {{ ['A', 'B', 'C', 'D'][i] }}"
              />
            </mat-form-field>
            <mat-checkbox
              formControlName="isCorrect"
              color="primary"
              (change)="onCorrectChange(i)"
              >නිවැරදි</mat-checkbox
            >
          </div>
        </div>

        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="questionForm.invalid || saving"
        >
          <mat-icon>save</mat-icon> {{ editingId ? 'යාවත්කාලීන' : 'සුරකින්න' }}
        </button>
      </form>
    </mat-card>

    <!-- Action bar -->
    <div class="action-bar mb-16" *ngIf="!showForm">
      <button mat-flat-button color="primary" (click)="openCreateForm()">
        <mat-icon>add</mat-icon> නව ප්‍රශ්නයක්
      </button>
    </div>

    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <!-- Questions List -->
    <div class="questions-list" *ngIf="!loading">
      <mat-card class="q-card" *ngFor="let q of questions">
        <div class="q-card__header">
          <span class="status-badge status-{{ q.status }}">{{
            getStatusLabel(q.status)
          }}</span>
          <span class="chip">{{ q.subjectName }}</span>
          <span class="chip year">{{ q.year }}</span>
          <span class="chip author">{{ q.createdByEmail }}</span>
        </div>
        <p class="q-text">{{ q.questionText }}</p>
        <div class="q-card__actions">
          <button
            mat-icon-button
            matTooltip="සංස්කරණය"
            (click)="editQuestion(q)"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            matTooltip="මකා දැමීම"
            color="warn"
            (click)="deleteQuestion(q)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && questions.length === 0"
      icon="quiz"
      title="ප්‍රශ්න නොමැත"
      message="තවම ප්‍රශ්න නොමැත."
    ></app-empty-state>

    <mat-paginator
      *ngIf="totalElements > pageSize"
      [length]="totalElements"
      [pageSize]="pageSize"
      [pageIndex]="currentPage"
      (page)="onPageChange($event)"
      [hidePageSize]="true"
    >
    </mat-paginator>
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
        margin-bottom: 8px;
      }
      .option-label {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 700;
        font-size: 13px;
        background: #e8eaf6;
        color: #0b3d91;
        flex-shrink: 0;
      }
      .flex-grow {
        flex: 1;
      }
      .action-bar {
        display: flex;
        justify-content: flex-end;
      }
      .questions-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .q-card {
        padding: 18px 22px !important;
      }
      .q-card__header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .chip {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        background: rgba(11, 61, 145, 0.08);
        border-radius: 4px;
        color: #0b3d91;
      }
      .chip.author {
        background: rgba(0, 0, 0, 0.05);
        color: #666;
      }
      .chip.year {
        background: rgba(46, 125, 50, 0.08);
        color: #2e7d32;
      }
      .q-text {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .q-card__actions {
        display: flex;
        gap: 4px;
        justify-content: flex-end;
      }
    `,
  ],
})
export class SuperadminQuestionsComponent implements OnInit {
  questions: QuestionDto[] = [];
  subjects: SubjectDto[] = [];
  loading = true;
  saving = false;
  showForm = false;
  editingId: string | null = null;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  yearOptions: number[] = [];

  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {
    this.questionForm = this.buildForm();
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= 2020; y--) {
      this.yearOptions.push(y);
    }
    this.api.getSubjects().subscribe((s) => (this.subjects = s));
    this.loadQuestions();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      subjectId: ['', Validators.required],
      year: [null as number | null, Validators.required],
      questionText: ['', Validators.required],
      options: this.fb.array(
        [0, 1, 2, 3].map((i) =>
          this.fb.group({
            optionText: ['', Validators.required],
            isCorrect: [false],
            optionOrder: [i + 1],
          }),
        ),
        { validators: [this.exactlyOneCorrect] },
      ),
    });
  }

  private exactlyOneCorrect(control: AbstractControl): ValidationErrors | null {
    const arr = control as FormArray;
    const count = arr.controls.filter((c) => c.get('isCorrect')?.value).length;
    return count === 1 ? null : { exactlyOneCorrect: true };
  }

  onCorrectChange(index: number): void {
    this.optionsArray.controls.forEach((c, i) => {
      if (i !== index) c.get('isCorrect')?.setValue(false);
    });
  }

  loadQuestions(): void {
    this.loading = true;
    this.api.superGetQuestions(this.currentPage, this.pageSize).subscribe({
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

  openCreateForm(): void {
    this.editingId = null;
    this.questionForm = this.buildForm();
    this.showForm = true;
  }

  editQuestion(q: QuestionDto): void {
    this.editingId = q.id;
    this.questionForm = this.buildForm();
    this.questionForm.patchValue({
      subjectId: q.subjectId,
      year: q.year,
      questionText: q.questionText,
    });
    q.options.forEach((opt, i) => {
      if (this.optionsArray.at(i)) {
        this.optionsArray.at(i).patchValue({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
          optionOrder: opt.optionOrder,
        });
      }
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  saveQuestion(): void {
    if (this.questionForm.invalid) return;
    this.saving = true;
    const val = this.questionForm.value;

    if (this.editingId) {
      this.api
        .superUpdateQuestion(this.editingId, {
          questionText: val.questionText,
          options: val.options,
        })
        .subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය යාවත්කාලීන කරන ලදී!');
            this.cancelForm();
            this.loadQuestions();
            this.saving = false;
          },
          error: (err) => {
            this.notify.error(err.error?.message || 'යාවත්කාලීන අසාර්ථකයි.');
            this.saving = false;
          },
        });
    } else {
      this.api.superCreateQuestion(val).subscribe({
        next: () => {
          this.notify.success('ප්‍රශ්නය සාර්ථකව සාදන ලදී!');
          this.cancelForm();
          this.loadQuestions();
          this.saving = false;
        },
        error: (err) => {
          this.notify.error(err.error?.message || 'සෑදීම අසාර්ථකයි.');
          this.saving = false;
        },
      });
    }
  }

  deleteQuestion(q: QuestionDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය මකා දැමීම',
        message: `"${q.questionText.substring(0, 60)}..." ප්‍රශ්නය ස්ථිරවම මකා දැමීමට අවශ්‍යද? මෙය ආපසු හැරවිය නොහැක.`,
        confirmText: 'මකා දමන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.superDeleteQuestion(q.id).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය මකා දමන ලදී.');
            this.loadQuestions();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
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
}
