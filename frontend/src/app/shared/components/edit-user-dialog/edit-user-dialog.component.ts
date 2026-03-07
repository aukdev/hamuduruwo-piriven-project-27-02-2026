import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDto, UserUpdateRequest } from '../../../core/models';

@Component({
  selector: 'app-edit-user-dialog',
  template: `
    <h2 mat-dialog-title>පරිශීලක තොරතුරු සංස්කරණය</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="edit-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>සම්පූර්ණ නම</mat-label>
          <input matInput formControlName="fullName" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ඊමේල්</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>භූමිකාව</mat-label>
          <mat-select formControlName="role">
            <mat-option value="STUDENT">ශිෂ්‍යයා</mat-option>
            <mat-option value="TEACHER">ගුරුවරයා</mat-option>
            <mat-option value="ADMIN">පරිපාලක</mat-option>
            <mat-option value="SUPER_ADMIN">ප්‍රධාන පරිපාලක</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>තත්ත්වය</mat-label>
          <mat-select formControlName="status">
            <mat-option value="ACTIVE">සක්‍රිය</mat-option>
            <mat-option value="DEACTIVATED">අක්‍රිය</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-checkbox
          formControlName="teacherVerified"
          *ngIf="form.get('role')?.value === 'TEACHER'"
        >
          ගුරු සත්‍යාපනය කර ඇත
        </mat-checkbox>
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
        gap: 4px;
        min-width: 350px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class EditUserDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto,
  ) {
    this.form = this.fb.group({
      fullName: [data.fullName, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      role: [data.role, [Validators.required]],
      status: [data.status, [Validators.required]],
      teacherVerified: [data.teacherVerified],
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as UserUpdateRequest);
    }
  }
}
