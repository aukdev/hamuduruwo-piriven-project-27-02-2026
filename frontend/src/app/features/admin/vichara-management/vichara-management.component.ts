import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  VcharaSubjectDto,
  VcharaDto,
  PagedResponse,
} from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vichara-management',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    QuillModule,
    PageHeaderComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './vichara-management.component.html',
  styleUrls: ['./vichara-management.component.scss'],
})
export class VcharaManagementComponent implements OnInit {
  subjects: VcharaSubjectDto[] = [];
  vicharas: VcharaDto[] = [];
  selectedSubjectId = '';
  loading = true;
  loadingVicharas = false;
  saving = false;

  // pagination
  page = 0;
  size = 10;
  totalElements = 0;

  // form mode
  showForm = false;
  editingId: string | null = null;
  vcharaForm: FormGroup;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private sanitizer: DomSanitizer,
  ) {
    this.vcharaForm = this.fb.group({
      vcharaSubjectId: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.api.getAdminVcharaSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        if (subjects.length > 0) {
          this.selectedSubjectId = subjects[0].id;
          this.loadVicharas();
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  onSubjectChange(subjectId: string): void {
    this.selectedSubjectId = subjectId;
    this.page = 0;
    this.loadVicharas();
  }

  loadVicharas(): void {
    this.loadingVicharas = true;
    this.api
      .getAdminVicharas(this.selectedSubjectId, this.page, this.size)
      .subscribe({
        next: (res: PagedResponse<VcharaDto>) => {
          this.vicharas = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
          this.loadingVicharas = false;
        },
        error: () => {
          this.loading = false;
          this.loadingVicharas = false;
        },
      });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadVicharas();
  }

  openCreateForm(): void {
    this.editingId = null;
    this.vcharaForm.reset({ vcharaSubjectId: this.selectedSubjectId });
    this.showForm = true;
  }

  openEditForm(v: VcharaDto): void {
    this.editingId = v.id;
    this.vcharaForm.patchValue({
      vcharaSubjectId: v.vcharaSubjectId,
      title: v.title,
      content: v.content,
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.vcharaForm.reset();
  }

  saveVichara(): void {
    if (this.vcharaForm.invalid) return;
    this.saving = true;
    const payload = this.vcharaForm.value;

    const obs = this.editingId
      ? this.api.updateVichara(this.editingId, payload)
      : this.api.createVichara(payload);

    obs.subscribe({
      next: () => {
        this.notify.success(
          this.editingId
            ? 'විචාරය සාර්ථකව යාවත්කාලීන කරන ලදී.'
            : 'විචාරය සාර්ථකව එකතු කරන ලදී!',
        );
        this.cancelForm();
        this.loadVicharas();
        this.saving = false;
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'ක්‍රියාව අසාර්ථකයි.');
        this.saving = false;
      },
    });
  }

  deleteVichara(v: VcharaDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'විචාරය මකා දැමීම',
        message: `"${v.title}" විචාරය ස්ථිරවම මකා දැමීමට අවශ්‍යද?`,
        confirmText: 'ස්ථිරවම මකන්න',
        dangerous: true,
      },
      width: '440px',
    });
    ref.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.api.deleteVichara(v.id).subscribe({
          next: () => {
            this.notify.success('විචාරය මකා දමන ලදී.');
            this.loadVicharas();
          },
          error: (err) =>
            this.notify.error(err.error?.message || 'මකා දැමීම අසාර්ථකයි.'),
        });
      }
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
