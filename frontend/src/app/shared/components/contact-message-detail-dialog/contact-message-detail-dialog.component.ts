import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactMessageDto } from '../../../core/models';

@Component({
  selector: 'app-contact-message-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './contact-message-detail-dialog.component.html',
  styleUrls: ['./contact-message-detail-dialog.component.scss'],
})
export class ContactMessageDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ContactMessageDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactMessageDto,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  get mailtoHref(): string {
    const subject = this.data.subject
      ? `Re: ${this.data.subject}`
      : 'Re: පිරිවෙන් MCQ';
    return `mailto:${this.data.email}?subject=${encodeURIComponent(subject)}`;
  }
}
