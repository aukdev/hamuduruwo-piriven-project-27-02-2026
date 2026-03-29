import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['STUDENT', Validators.required],
      pirivenName: [''],
      pirivenAddress: [''],
      phoneNumber: [''],
    });

    this.form.get('role')?.valueChanges.subscribe((role) => {
      const pirivenName = this.form.get('pirivenName')!;
      const pirivenAddress = this.form.get('pirivenAddress')!;
      const phoneNumber = this.form.get('phoneNumber')!;

      if (role === 'TEACHER') {
        pirivenName.setValidators([Validators.required]);
        pirivenAddress.setValidators([Validators.required]);
        phoneNumber.setValidators([Validators.required]);
      } else {
        pirivenName.clearValidators();
        pirivenAddress.clearValidators();
        phoneNumber.clearValidators();
      }
      pirivenName.updateValueAndValidity();
      pirivenAddress.updateValueAndValidity();
      phoneNumber.updateValueAndValidity();
    });
  }

  get isTeacher(): boolean {
    return this.form.get('role')?.value === 'TEACHER';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload = { ...this.form.value };
    if (!this.isTeacher) {
      delete payload.pirivenName;
      delete payload.pirivenAddress;
      delete payload.phoneNumber;
    }

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.token) {
          this.notify.success('ලියාපදිංචිය සාර්ථකයි!');
          this.auth.navigateByRole();
        } else {
          this.notify.success(
            'ලියාපදිංචිය සාර්ථකයි! පරිපාලක අනුමැතියෙන් පසු ඔබට පිවිසිය හැකිය.',
          );
          this.router.navigate(['/login']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        const msg = err.error?.message || 'ලියාපදිංචිය අසාර්ථකයි.';
        this.notify.error(msg);
      },
    });
  }
}
