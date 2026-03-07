import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDto } from '../../../core/models';

@Component({
  selector: 'app-reset-password-dialog',
  template: `
    <h2 mat-dialog-title>මුරපදය යළි පිහිටුවීම</h2>
    <mat-dialog-content>
      <p class="user-label">{{ data.fullName }} ({{ data.email }})</p>
      <form [formGroup]="form" class="reset-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>නව මුරපදය</mat-label>
          <input matInput formControlName="newPassword" type="text" />
          <mat-hint>අවම අක්ෂර 6ක්</mat-hint>
          <mat-error *ngIf="form.get('newPassword')?.hasError('required')"
            >මුරපදය අවශ්‍යයි</mat-error
          >
          <mat-error *ngIf="form.get('newPassword')?.hasError('minlength')"
            >අවම අක්ෂර 6ක් අවශ්‍යයි</mat-error
          >
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>අවලංගු</button>
      <button
        mat-raised-button
        color="warn"
        [disabled]="form.invalid"
        (click)="reset()"
      >
        මුරපදය යළි පිහිටුවන්න
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .reset-form {
        min-width: 350px;
      }
      .full-width {
        width: 100%;
      }
      .user-label {
        color: #555;
        margin-bottom: 12px;
      }
    `,
  ],
})
export class ResetPasswordDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto,
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  reset(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.newPassword);
    }
  }
}
