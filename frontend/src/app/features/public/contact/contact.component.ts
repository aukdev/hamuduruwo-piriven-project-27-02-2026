import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  submitted = false;

  onSubmit() {
    if (this.form.name && this.form.email && this.form.message) {
      this.submitted = true;
    }
  }
}
