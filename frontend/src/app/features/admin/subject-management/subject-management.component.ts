import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubjectDto, UpdateSubjectRequest } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditSubjectDialogComponent } from '../../../shared/components/edit-subject-dialog/edit-subject-dialog.component';

@Component({
  selector: 'app-subject-management',
  template: `
    <app-page-header
      title="විෂය කළමනාකරණය"
      subtitle="විෂයයන් එකතු කිරීම සහ ගුරුවරුන්ට පැවරීම"
    >
    </app-page-header>

    <div class="layout-two-col">
      <!-- Create Subject -->
      <mat-card class="create-card">
        <h3 class="card-title">
          <mat-icon>add_circle</mat-icon> නව විෂයයක් එකතු කරන්න
        </h3>
        <form [formGroup]="subjectForm" (ngSubmit)="createSubject()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>විෂය නාමය</mat-label>
            <input
              matInput
              formControlName="name"
              placeholder="උදා: බුද්ධ ධර්මය"
            />
            <mat-error *ngIf="subjectForm.get('name')?.hasError('required')"
              >විෂය නාමය අවශ්‍යයි</mat-error
            >
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>විස්තරය (විකල්ප)</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="2"
            ></textarea>
          </mat-form-field>
          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="subjectForm.invalid || creating"
          >
            <mat-icon>save</mat-icon> සුරකින්න
          </button>
        </form>
      </mat-card>

      <!-- Assign Subject to Teacher -->
      <mat-card class="assign-card">
        <h3 class="card-title">
          <mat-icon>person_add</mat-icon> ගුරුවරයෙකුට විෂයයක් පවරන්න
        </h3>
        <form [formGroup]="assignForm" (ngSubmit)="assignSubject()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ගුරුවරයාගේ ID</mat-label>
            <input
              matInput
              formControlName="teacherId"
              placeholder="ගුරුවරයාගේ ID ඇතුළත් කරන්න"
            />
            <mat-error>ID අවශ්‍යයි</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>විෂයය</mat-label>
            <mat-select formControlName="subjectId">
              <mat-option *ngFor="let s of subjects" [value]="s.id">{{
                s.name
              }}</mat-option>
            </mat-select>
            <mat-error>විෂයයක් තෝරන්න</mat-error>
          </mat-form-field>
          <button
            mat-flat-button
            color="accent"
            type="submit"
            [disabled]="assignForm.invalid || assigning"
          >
            <mat-icon>link</mat-icon> පවරන්න
          </button>
        </form>
      </mat-card>
    </div>

    <!-- Existing Subjects -->
    <h3 class="section-title mt-24">පවතින විෂයයන්</h3>
    <app-skeleton
      *ngIf="loading"
      type="card-grid"
      [count]="6"
      gridMinWidth="260px"
    ></app-skeleton>
    <div class="subjects-grid" *ngIf="!loading">
      <mat-card class="subject-chip-card" *ngFor="let s of subjects">
        <div class="subject-content">
          <mat-icon color="primary">menu_book</mat-icon>
          <div class="subject-text">
            <strong>{{ s.name }}</strong>
            <p *ngIf="s.description">{{ s.description }}</p>
            <span class="subject-date">{{
              s.createdAt | date: 'yyyy-MM-dd'
            }}</span>
          </div>
        </div>
        <div class="subject-actions">
          <button
            mat-icon-button
            color="primary"
            matTooltip="සංස්කරණය"
            (click)="editSubject(s)"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            matTooltip="මකා දැමීම"
            (click)="deleteSubject(s)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
    <app-empty-state
      *ngIf="!loading && subjects.length === 0"
      icon="library_books"
      title="විෂයයන් නොමැත"
      message="තවම විෂයයන් එකතු කර නොමැත."
    ></app-empty-state>
  `,
  styles: [
    `
      .layout-two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }
      .create-card,
      .assign-card {
        padding: 24px !important;
      }
      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        color: var(--color-primary);
        margin: 0 0 16px;
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
      .full-width {
        width: 100%;
      }
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      .subjects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .subject-chip-card {
        padding: 16px !important;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .subject-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          mat-icon {
            margin-top: 2px;
          }
        }
        .subject-text {
          flex: 1;
          strong {
            font-size: 14px;
            color: var(--color-text-primary);
          }
          p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #666;
          }
          .subject-date {
            font-size: 11px;
            color: #999;
          }
        }
        .subject-actions {
          display: flex;
          justify-content: flex-end;
          gap: 2px;
          margin-top: -4px;
        }
      }
    `,
  ],
})
export class SubjectManagementComponent implements OnInit {
  subjects: SubjectDto[] = [];
  loading = true;
  creating = false;
  assigning = false;

  subjectForm: FormGroup;
  assignForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.assignForm = this.fb.group({
      teacherId: ['', Validators.required],
      subjectId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.api.getSubjects().subscribe({
      next: (s) => {
        this.subjects = s;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  createSubject(): void {
    if (this.subjectForm.invalid) return;
    this.creating = true;
    this.api.createSubject(this.subjectForm.value).subscribe({
      next: () => {
        this.notify.success('විෂයය සාර්ථකව එකතු කරන ලදී!');
        this.subjectForm.reset();
        this.loadSubjects();
        this.creating = false;
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'විෂයය එකතු කිරීම අසාර්ථකයි.');
        this.creating = false;
      },
    });
  }

  assignSubject(): void {
    if (this.assignForm.invalid) return;
    this.assigning = true;
    const { teacherId, subjectId } = this.assignForm.value;
    this.api.assignSubjectToTeacher(teacherId, subjectId).subscribe({
      next: () => {
        this.notify.success('විෂයය ගුරුවරයාට සාර්ථකව පවරන ලදී!');
        this.assignForm.reset();
        this.assigning = false;
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'පවරීම අසාර්ථකයි.');
        this.assigning = false;
      },
    });
  }

  editSubject(s: SubjectDto): void {
    const ref = this.dialog.open(EditSubjectDialogComponent, {
      data: s,
      width: '480px',
    });
    ref.afterClosed().subscribe((result: UpdateSubjectRequest | undefined) => {
      if (result) {
        this.api.updateSubject(s.id, result).subscribe({
          next: () => {
            this.notify.success('විෂයය සාර්ථකව යාවත්කාලීන කරන ලදී.');
            this.loadSubjects();
          },
          error: (err) =>
            this.notify.error(
              err.error?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි.',
            ),
        });
      }
    });
  }

  deleteSubject(s: SubjectDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'විෂයය මකා දැමීම',
        message: `"${s.name}" විෂයය ස්ථිරවම මකා දැමීමට අවශ්‍යද?\nමෙම ක්‍රියාව ආපසු හැරවිය නොහැක!`,
        confirmText: 'ස්ථිරවම මකන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.api.deleteSubject(s.id).subscribe({
          next: () => {
            this.notify.success('විෂයය මකා දමන ලදී.');
            this.loadSubjects();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
  }
}
