import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubjectDto, UpdateSubjectRequest } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditSubjectDialogComponent } from '../../../shared/components/edit-subject-dialog/edit-subject-dialog.component';

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.scss'],
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
