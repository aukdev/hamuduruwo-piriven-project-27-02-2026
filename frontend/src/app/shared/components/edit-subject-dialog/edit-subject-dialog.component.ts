import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-edit-subject-dialog',
  template: `
    <h2 mat-dialog-title>විෂයය සංස්කරණය කරන්න</h2>
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
export class EditSubjectDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubjectDto,
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description || ''],
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
