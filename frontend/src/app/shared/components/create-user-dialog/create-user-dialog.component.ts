import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user-dialog',
  template: `
    <h2 mat-dialog-title>නව පරිශීලකයෙකු එක් කරන්න</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="create-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>සම්පූර්ණ නම</mat-label>
          <input matInput formControlName="fullName" />
          <mat-error *ngIf="form.get('fullName')?.hasError('required')"
            >නම අවශ්‍යයි</mat-error
          >
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ඊමේල්</mat-label>
          <input matInput formControlName="email" type="email" />
          <mat-error *ngIf="form.get('email')?.hasError('required')"
            >ඊමේල් අවශ්‍යයි</mat-error
          >
          <mat-error *ngIf="form.get('email')?.hasError('email')"
            >වලංගු ඊමේල් ඇතුළත් කරන්න</mat-error
          >
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>මුරපදය</mat-label>
          <input matInput formControlName="password" type="text" />
          <mat-hint>අවම අක්ෂර 6ක්</mat-hint>
          <mat-error *ngIf="form.get('password')?.hasError('required')"
            >මුරපදය අවශ්‍යයි</mat-error
          >
          <mat-error *ngIf="form.get('password')?.hasError('minlength')"
            >අවම අක්ෂර 6ක් අවශ්‍යයි</mat-error
          >
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>භූමිකාව</mat-label>
          <mat-select formControlName="role">
            <mat-option value="STUDENT">ශිෂ්‍යයා</mat-option>
            <mat-option value="TEACHER">ගුරුවරයා</mat-option>
            <mat-option value="ADMIN">පරිපාලක</mat-option>
            <mat-option value="SUPER_ADMIN">ප්‍රධාන පරිපාලක</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('role')?.hasError('required')"
            >භූමිකාව අවශ්‍යයි</mat-error
          >
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>අවලංගු</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="form.invalid"
        (click)="create()"
      >
        එක් කරන්න
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .create-form {
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
export class CreateUserDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['STUDENT', [Validators.required]],
    });
  }

  create(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
