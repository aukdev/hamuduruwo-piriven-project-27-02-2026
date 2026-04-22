import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);

  form = { name: '', email: '', subject: '', message: '' };
  submitted = false;
  submitting = false;

  onSubmit() {
    if (this.submitting) return;

    const name = this.form.name.trim();
    const email = this.form.email.trim();
    const message = this.form.message.trim();

    if (!name || !email || !message) {
      this.snack.open('කරුණාකර නම, ඊමේල් සහ පණිවිඩය ඇතුළත් කරන්න', 'හරි', {
        duration: 3500,
      });
      return;
    }

    this.submitting = true;
    this.api
      .submitContactMessage({
        name,
        email,
        subject: this.form.subject.trim() || undefined,
        message,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.submitted = true;
          this.form = { name: '', email: '', subject: '', message: '' };
        },
        error: (err) => {
          this.submitting = false;
          const msg =
            err?.error?.message ||
            'පණිවිඩය යැවීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.';
          this.snack.open(msg, 'හරි', { duration: 4000 });
        },
      });
  }
}
