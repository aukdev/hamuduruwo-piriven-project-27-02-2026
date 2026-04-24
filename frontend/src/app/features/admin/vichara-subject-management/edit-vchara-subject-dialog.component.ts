import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VcharaSubjectDto } from '../../../core/models';

@Component({
  selector: 'app-edit-vchara-subject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>විචාර විෂයය සංස්කරණය කරන්න</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="edit-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>විෂය නාමය</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="form.get('name')?.hasError('required')"
            >විෂය නාමය අවශ්‍යයි</mat-error
          >
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>විස්තරය (විකල්ප)</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ප්‍රදර්ශන අනුපිළිවෙල</mat-label>
          <input matInput type="number" formControlName="displayOrder" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>අවලංගු</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="form.invalid"
        (click)="save()"
      >
        සුරකින්න
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .edit-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 380px;
        padding-top: 8px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class EditVcharaSubjectDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditVcharaSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VcharaSubjectDto,
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description || ''],
      displayOrder: [data.displayOrder || 0],
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
