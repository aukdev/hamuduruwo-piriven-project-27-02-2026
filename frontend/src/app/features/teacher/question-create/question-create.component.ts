import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubjectDto, QuestionDto, PaperDto } from '../../../core/models';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [...SHARED_IMPORTS, PageHeaderComponent, LoadingOverlayComponent],
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss'],
})
export class QuestionCreateComponent implements OnInit {
  form!: FormGroup;
  subjects: SubjectDto[] = [];
  papers: PaperDto[] = [];
  isEdit = false;
  editId = '';
  saving = false;
  loadingPapers = false;
  optLabels = ['A', 'B', 'C', 'D'];
  private existingQuestion?: QuestionDto;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.editId = this.route.snapshot.params['id'];
    this.isEdit = !!this.editId;

    this.api.getMySubjects().subscribe((s) => (this.subjects = s));

    if (this.isEdit) {
      this.loadQuestion();
    } else {
      // Pre-select paper if navigated from papers page
      const qPaperId = this.route.snapshot.queryParams['paperId'];
      if (qPaperId) {
        this.api.getTeacherPapers().subscribe((papers) => {
          const target = papers.find((p) => p.id === qPaperId);
          if (target) {
            this.form.patchValue({ subjectId: target.subjectId });
            this.papers = papers.filter(
              (p) => p.subjectId === target.subjectId,
            );
            this.form.patchValue({ paperId: qPaperId });
          }
        });
      }
    }
  }

  get optionsArray(): FormArray {
    return this.form.get('options') as FormArray;
  }

  private buildForm(): void {
    this.form = this.fb.group(
      {
        subjectId: ['', Validators.required],
        paperId: ['', Validators.required],
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

  onCorrectChange(index: number): void {
    // Ensure only one is correct
    this.optionsArray.controls.forEach((ctrl, i) => {
      if (i !== index) {
        ctrl.get('isCorrect')?.setValue(false, { emitEvent: false });
      }
    });
  }

  onSubjectChange(subjectId: string): void {
    this.form.patchValue({ paperId: '' });
    this.papers = [];
    if (!subjectId) return;
    this.loadingPapers = true;
    this.api.getTeacherPapersBySubject(subjectId).subscribe({
      next: (papers) => {
        this.papers = papers;
        this.loadingPapers = false;
      },
      error: () => (this.loadingPapers = false),
    });
  }

  private loadQuestion(): void {
    // Load from teacher's questions list
    this.api.getMyQuestions(0, 200).subscribe({
      next: (res) => {
        const q = res.content.find((q) => q.id === this.editId);
        if (q) {
          this.existingQuestion = q;
          this.form.patchValue({
            subjectId: q.subjectId,
            paperId: q.paperId || '',
            questionText: q.questionText,
          });
          if (q.subjectId) {
            this.api
              .getTeacherPapersBySubject(q.subjectId)
              .subscribe((papers) => (this.papers = papers));
          }
          q.options
            .sort((a, b) => a.optionOrder - b.optionOrder)
            .forEach((opt, i) => {
              if (this.optionsArray.at(i)) {
                this.optionsArray.at(i).patchValue({
                  optionText: opt.optionText,
                  isCorrect: opt.isCorrect || false,
                  optionOrder: opt.optionOrder,
                });
              }
            });
        }
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const val = this.form.value;

    if (this.isEdit) {
      this.api
        .updateQuestion(this.editId, {
          questionText: val.questionText,
          options: val.options,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.notify.success('ප්‍රශ්නය යාවත්කාලීන කරන ලදී!');
            this.router.navigate(['/teacher/questions']);
          },
          error: (err) => {
            this.saving = false;
            this.notify.error(
              err.error?.message || 'යාවත්කාලීන කිරීම අසාර්ථකයි.',
            );
          },
        });
    } else {
      this.api
        .createQuestion({
          paperId: val.paperId,
          questionText: val.questionText,
          options: val.options,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.notify.success('ප්‍රශ්නය සාර්ථකව සාදන ලදී!');
            this.router.navigate(['/teacher/questions']);
          },
          error: (err) => {
            this.saving = false;
            this.notify.error(
              err.error?.message || 'ප්‍රශ්නය සෑදීම අසාර්ථකයි.',
            );
          },
        });
    }
  }
}
