import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-testimonial-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './testimonial-form-dialog.component.html',
  styleUrls: ['./testimonial-form-dialog.component.scss'],
})
export class TestimonialFormDialogComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  submitting = false;
  selectedRating = 0;

  constructor(
    public dialogRef: MatDialogRef<TestimonialFormDialogComponent>,
    private fb: FormBuilder,
    private api: ApiService,
    private notify: NotificationService,
  ) {
    this.form = this.fb.group({
      quote: ['', [Validators.required, Validators.maxLength(1000)]],
      positionTitle: ['', [Validators.maxLength(200)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  setRating(star: number): void {
    this.selectedRating = star;
    this.form.patchValue({ rating: star });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.notify.error('ඡායාරූපය 2MB ට වඩා අඩු විය යුතුය');
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.notify.error('කරුණාකර image file එකක් තෝරන්න');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;

    const data = this.form.value;
    this.api.submitTestimonial(data, this.selectedFile || undefined).subscribe({
      next: () => {
        this.notify.success('ඔබගේ අදහස සාර්ථකව ඉදිරිපත් කරන ලදී! ස්තූතියි.');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.submitting = false;
        this.notify.error(
          err.error?.message || 'අදහස ඉදිරිපත් කිරීම අසාර්ථකයි',
        );
      },
    });
  }
}
