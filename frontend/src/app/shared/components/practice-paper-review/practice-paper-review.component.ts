import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../shared-imports';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  PaperDetailDto,
  PaperQuestionInfo,
  QuestionOptionRequest,
} from '../../../core/models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-practice-paper-review',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    PageHeaderComponent,
    LoadingOverlayComponent,
    EmptyStateComponent,
  ],
  templateUrl: './practice-paper-review.component.html',
  styleUrls: ['./practice-paper-review.component.scss'],
})
export class PracticePaperReviewComponent implements OnInit {
  paperId = '';
  paper: PaperDetailDto | null = null;
  loading = true;
  saving = false;

  // Edit question
  editingQuestionId: string | null = null;
  editForm!: FormGroup;
  optLabels = ['A', 'B', 'C', 'D'];

  // Add question
  showAddForm = false;
  addForm!: FormGroup;

  private listPath = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private notify: NotificationService,
    private auth: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.paperId = this.route.snapshot.params['paperId'];
    const role = this.auth.currentUser?.role;
    this.listPath =
      role === 'SUPER_ADMIN'
        ? '/superadmin/practice-paper-management'
        : '/admin/practice-paper-management';
    this.buildEditForm();
    this.buildAddForm();
    this.loadPaper();
  }

  loadPaper(): void {
    this.loading = true;
    this.api.getPaperDetail(this.paperId).subscribe({
      next: (paper) => {
        this.paper = paper;
        this.loading = false;
      },
      error: () => {
        this.notify.error('පත්‍රය පූරණය අසාර්ථකයි.');
        this.loading = false;
      },
    });
  }

  // ==================== Edit Question ====================

  startEdit(q: PaperQuestionInfo): void {
    this.editingQuestionId = q.questionId;
    this.editForm.patchValue({ questionText: q.questionText });
    const optionsArr = this.editForm.get('options') as FormArray;
    q.options
      .sort((a, b) => a.optionOrder - b.optionOrder)
      .forEach((opt, i) => {
        if (optionsArr.at(i)) {
          optionsArr.at(i).patchValue({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            optionOrder: opt.optionOrder,
          });
        }
      });
  }

  cancelEdit(): void {
    this.editingQuestionId = null;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.editingQuestionId) return;
    this.saving = true;
    const val = this.editForm.value;
    this.api
      .superUpdateQuestion(this.editingQuestionId, {
        questionText: val.questionText,
        options: val.options,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.editingQuestionId = null;
          this.notify.success('ප්‍රශ්නය යාවත්කාලීන කරන ලදී!');
          this.loadPaper();
        },
        error: (err) => {
          this.saving = false;
          this.notify.error(
            err.error?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි.',
          );
        },
      });
  }

  onEditCorrectChange(index: number): void {
    const arr = this.editForm.get('options') as FormArray;
    arr.controls.forEach((ctrl, i) => {
      if (i !== index) {
        ctrl.get('isCorrect')?.setValue(false, { emitEvent: false });
      }
    });
  }

  get editOptionsArray(): FormArray {
    return this.editForm.get('options') as FormArray;
  }

  // ==================== Remove Question ====================

  removeQuestion(q: PaperQuestionInfo): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ප්‍රශ්නය ඉවත් කරන්න',
        message: `ප්‍රශ්නය #${q.position} ඉවත් කිරීමට අවශ්‍යද?\n\n"${q.questionText.substring(0, 80)}..."`,
        confirmText: 'ඉවත් කරන්න',
        dangerous: true,
      },
      width: '420px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.removeQuestionFromPaper(this.paperId, q.questionId).subscribe({
          next: () => {
            this.notify.success('ප්‍රශ්නය ඉවත් කරන ලදී.');
            this.loadPaper();
          },
          error: (err: any) =>
            this.notify.error(err.error?.message || 'ඉවත් කිරීම අසාර්ථකයි.'),
        });
      }
    });
  }

  // ==================== Add Question ====================

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.buildAddForm();
    }
  }

  saveNewQuestion(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const val = this.addForm.value;
    this.api
      .createQuestionForPaper(this.paperId, {
        questionText: val.questionText,
        options: val.options,
      })
      .subscribe({
        next: (detail) => {
          this.saving = false;
          this.showAddForm = false;
          this.paper = detail;
          this.notify.success('නව ප්‍රශ්නය එකතු කරන ලදී!');
        },
        error: (err) => {
          this.saving = false;
          this.notify.error(
            err.error?.message || 'ප්‍රශ්නය එකතු කිරීම අසාර්ථකයි.',
          );
        },
      });
  }

  onAddCorrectChange(index: number): void {
    const arr = this.addForm.get('options') as FormArray;
    arr.controls.forEach((ctrl, i) => {
      if (i !== index) {
        ctrl.get('isCorrect')?.setValue(false, { emitEvent: false });
      }
    });
  }

  get addOptionsArray(): FormArray {
    return this.addForm.get('options') as FormArray;
  }

  // ==================== Approve / Reject ====================

  approve(): void {
    if (!this.paper) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පුහුණු පත්‍රය අනුමත කරන්න',
        message: `"${this.paper.title}" අනුමත කිරීමට අවශ්‍යද?`,
        confirmText: 'අනුමත කරන්න',
      },
      width: '420px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.approvePracticePaper(this.paperId).subscribe({
          next: () => {
            this.notify.success('පුහුණු පත්‍රය සාර්ථකව අනුමත කරන ලදී!');
            this.router.navigate([this.listPath]);
          },
          error: (err: any) =>
            this.notify.error(err.error?.message || 'අනුමත කිරීම අසාර්ථකයි.'),
        });
      }
    });
  }

  reject(): void {
    if (!this.paper) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පුහුණු පත්‍රය ප්‍රතික්ෂේප කරන්න',
        message: 'ප්‍රතික්ෂේප කිරීමේ හේතුව ඇතුළත් කරන්න:',
        confirmText: 'ප්‍රතික්ෂේප කරන්න',
        dangerous: true,
        showInput: true,
        inputLabel: 'හේතුව',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result && result.inputValue) {
        this.api
          .rejectPracticePaper(this.paperId, { reason: result.inputValue })
          .subscribe({
            next: () => {
              this.notify.success('පුහුණු පත්‍රය ප්‍රතික්ෂේප කරන ලදී.');
              this.router.navigate([this.listPath]);
            },
            error: (err: any) =>
              this.notify.error(
                err.error?.message || 'ප්‍රතික්ෂේප කිරීම අසාර්ථකයි.',
              ),
          });
      }
    });
  }

  goBack(): void {
    this.router.navigate([this.listPath]);
  }

  // ==================== Helpers ====================

  private buildEditForm(): void {
    this.editForm = this.fb.group(
      {
        questionText: ['', Validators.required],
        options: this.fb.array([
          this.createOption(1),
          this.createOption(2),
          this.createOption(3),
          this.createOption(4),
        ]),
      },
      { validators: this.exactlyOneCorrectValidator },
    );
  }

  private buildAddForm(): void {
    this.addForm = this.fb.group(
      {
        questionText: ['', Validators.required],
        options: this.fb.array([
          this.createOption(1),
          this.createOption(2),
          this.createOption(3),
          this.createOption(4),
        ]),
      },
      { validators: this.exactlyOneCorrectValidator },
    );
  }

  private createOption(order: number): FormGroup {
    return this.fb.group({
      optionText: ['', Validators.required],
      isCorrect: [false],
      optionOrder: [order],
    });
  }

  private exactlyOneCorrectValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const options = control.get('options') as FormArray;
    if (!options) return null;
    const correctCount = options.controls.filter(
      (c) => c.get('isCorrect')?.value === true,
    ).length;
    return correctCount === 1 ? null : { exactlyOneCorrect: true };
  }
}
