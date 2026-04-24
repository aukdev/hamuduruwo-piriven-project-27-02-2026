import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  VcharaSubjectDto,
  UpdateVcharaSubjectRequest,
} from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditVcharaSubjectDialogComponent } from './edit-vchara-subject-dialog.component';

@Component({
  selector: 'app-vichara-subject-management',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    PageHeaderComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './vichara-subject-management.component.html',
  styleUrls: ['./vichara-subject-management.component.scss'],
})
export class VcharaSubjectManagementComponent implements OnInit {
  subjects: VcharaSubjectDto[] = [];
  loading = true;
  creating = false;

  subjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      displayOrder: [0],
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.api.getAdminVcharaSubjects().subscribe({
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
    this.api.createVcharaSubject(this.subjectForm.value).subscribe({
      next: () => {
        this.notify.success('විචාර විෂයය සාර්ථකව එකතු කරන ලදී!');
        this.subjectForm.reset({ displayOrder: 0 });
        this.loadSubjects();
        this.creating = false;
      },
      error: (err) => {
        this.notify.error(
          err.error?.message || 'විචාර විෂයය එකතු කිරීම අසාර්ථකයි.',
        );
        this.creating = false;
      },
    });
  }

  editSubject(s: VcharaSubjectDto): void {
    const ref = this.dialog.open(EditVcharaSubjectDialogComponent, {
      data: s,
      width: '480px',
    });
    ref
      .afterClosed()
      .subscribe((result: UpdateVcharaSubjectRequest | undefined) => {
        if (result) {
          this.api.updateVcharaSubject(s.id, result).subscribe({
            next: () => {
              this.notify.success('විචාර විෂයය සාර්ථකව යාවත්කාලීන කරන ලදී.');
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

  deleteSubject(s: VcharaSubjectDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'විචාර විෂයය මකා දැමීම',
        message: `"${s.name}" විචාර විෂයය ස්ථිරවම මකා දැමීමට අවශ්‍යද?\nමෙම ක්‍රියාව ආපසු හැරවිය නොහැක!`,
        confirmText: 'ස්ථිරවම මකන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.api.deleteVcharaSubject(s.id).subscribe({
          next: () => {
            this.notify.success('විචාර විෂයය මකා දමන ලදී.');
            this.loadSubjects();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
  }
}
