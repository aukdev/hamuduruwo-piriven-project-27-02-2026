import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TestimonialDto, UpdateTestimonialRequest } from '../../../core/models';

@Component({
  selector: 'app-edit-testimonial-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
  templateUrl: './edit-testimonial-dialog.component.html',
  styleUrls: ['./edit-testimonial-dialog.component.scss'],
})
export class EditTestimonialDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditTestimonialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TestimonialDto,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      quote: [data.quote || ''],
      positionTitle: [data.positionTitle || ''],
      rating: [data.rating || 5],
      isPublished: [data.isPublished || false],
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    if (this.form.valid) {
      const result: UpdateTestimonialRequest = this.form.value;
      this.dialogRef.close(result);
    }
  }
}
