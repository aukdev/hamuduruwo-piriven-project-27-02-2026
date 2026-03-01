import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubjectDto, QuestionDto } from '../../../core/models';

@Component({
  selector: 'app-question-create',
  template: `
    <app-page-header
      [title]="isEdit ? 'ප්‍රශ්නය සංස්කරණය' : 'නව ප්‍රශ්නයක් සාදන්න'"
      subtitle="ප්‍රශ්න හතරක් විකල්ප සමඟ ඇතුළත් කරන්න"
    >
      <button mat-stroked-button routerLink="/teacher/questions">
        <mat-icon>arrow_back</mat-icon> ආපසු
      </button>
    </app-page-header>

    <mat-card class="form-card">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Subject -->
        <mat-form-field appearance="outline" *ngIf="!isEdit">
          <mat-label>විෂය තෝරන්න</mat-label>
          <mat-select formControlName="subjectId">
            <mat-option *ngFor="let s of subjects" [value]="s.id">{{
              s.name
            }}</mat-option>
          </mat-select>
          <mat-error>විෂයක් තෝරන්න</mat-error>
        </mat-form-field>

        <!-- Question Text -->
        <mat-form-field appearance="outline">
          <mat-label>ප්‍රශ්නය</mat-label>
          <textarea
            matInput
            formControlName="questionText"
            rows="4"
            placeholder="ප්‍රශ්නය ඇතුළත් කරන්න..."
          ></textarea>
          <mat-error>ප්‍රශ්නය අවශ්‍යයි</mat-error>
        </mat-form-field>

        <!-- Options -->
        <div class="options-section">
          <h3 class="section-title">විකල්ප (හරියටම එකක් නිවැරදි විය යුතුය)</h3>

          <div formArrayName="options">
            <div
              *ngFor="let opt of optionsArray.controls; let i = index"
              [formGroupName]="i"
              class="option-form-row"
              [class.correct-option]="opt.get('isCorrect')?.value"
            >
              <div class="option-form-row__label">{{ optLabels[i] }}</div>

              <mat-form-field appearance="outline" class="option-input">
                <mat-label>විකල්ප {{ optLabels[i] }}</mat-label>
                <input
                  matInput
                  formControlName="optionText"
                  [placeholder]="'විකල්ප ' + optLabels[i] + ' ඇතුළත් කරන්න'"
                />
                <mat-error>විකල්පය අවශ්‍යයි</mat-error>
              </mat-form-field>

              <mat-checkbox
                formControlName="isCorrect"
                color="primary"
                (change)="onCorrectChange(i)"
              >
                නිවැරදි
              </mat-checkbox>
            </div>
          </div>

          <mat-error
            *ngIf="form.hasError('exactlyOneCorrect') && form.touched"
            style="font-size:12px; margin-top: 8px;"
          >
            හරියටම එක් නිවැරදි විකල්පයක් තෝරන්න
          </mat-error>
        </div>

        <!-- Actions -->
        <div class="form-actions mt-24">
          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="saving"
          >
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <span *ngIf="!saving">{{
              isEdit ? 'යාවත්කාලීන කරන්න' : 'සුරකින්න (කෙටුම්පත)'
            }}</span>
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [
    `
      .form-card {
        padding: 32px !important;
        max-width: 800px;
      }
      .options-section {
        margin-top: 16px;
      }
      .option-form-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        padding: 12px 16px;
        border: 1px solid #e0e3eb;
        border-radius: 12px;
        transition: all 0.2s;

        &.correct-option {
          background: rgba(46, 125, 50, 0.04);
          border-color: #2e7d32;
        }
      }
      .option-form-row__label {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f6f7fb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 15px;
        color: #0b3d91;
        flex-shrink: 0;
      }
      .correct-option .option-form-row__label {
        background: #2e7d32;
        color: #fff;
      }
      .option-input {
        flex: 1;
        margin-bottom: 0 !important;
      }
      .form-actions {
        display: flex;
        gap: 12px;
      }
      @media (max-width: 600px) {
        .option-form-row {
          flex-wrap: wrap;
        }
        .option-input {
          width: 100%;
        }
      }
    `,
  ],
})
export class QuestionCreateComponent implements OnInit {
  form!: FormGroup;
  subjects: SubjectDto[] = [];
  isEdit = false;
  editId = '';
  saving = false;
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

    this.api.getSubjects().subscribe((s) => (this.subjects = s));

    if (this.isEdit) {
      this.loadQuestion();
    }
  }

  get optionsArray(): FormArray {
    return this.form.get('options') as FormArray;
  }

  private buildForm(): void {
    this.form = this.fb.group(
      {
        subjectId: ['', Validators.required],
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

  private loadQuestion(): void {
    // Load from teacher's questions list
    this.api.getMyQuestions(0, 200).subscribe({
      next: (res) => {
        const q = res.content.find((q) => q.id === this.editId);
        if (q) {
          this.existingQuestion = q;
          this.form.patchValue({
            subjectId: q.subjectId,
            questionText: q.questionText,
          });
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
          subjectId: val.subjectId,
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
