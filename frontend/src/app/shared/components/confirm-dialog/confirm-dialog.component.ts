import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dangerous?: boolean;
  showInput?: boolean;
  inputLabel?: string;
  inputRequired?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      <mat-form-field
        *ngIf="data.inputLabel"
        class="w-100"
        appearance="outline"
      >
        <mat-label>{{ data.inputLabel }}</mat-label>
        <textarea matInput [(ngModel)]="inputValue" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'අවලංගු කරන්න' }}
      </button>
      <button
        mat-flat-button
        [color]="data.dangerous ? 'warn' : 'primary'"
        [disabled]="
          (data.showInput || data.inputRequired) && !inputValue?.trim()
        "
        (click)="onConfirm()"
      >
        {{ data.confirmText || 'තහවුරු කරන්න' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content p {
        font-size: 14px;
        color: #555770;
        margin-bottom: 16px;
        line-height: 1.6;
      }
      mat-dialog-actions {
        padding: 12px 24px 16px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  inputValue = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    this.dialogRef.close(
      this.data.inputLabel ? { inputValue: this.inputValue } : true,
    );
  }
}
