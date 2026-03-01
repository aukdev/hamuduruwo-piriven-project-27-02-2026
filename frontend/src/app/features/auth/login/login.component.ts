import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-card__header">
          <div class="auth-card__logo" routerLink="/">
            <mat-icon>school</mat-icon>
          </div>
          <h1>පිවිසීම</h1>
          <p class="text-muted">ඔබේ ගිණුමට පිවිසෙන්න / Login to your account</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>ඊමේල් ලිපිනය</mat-label>
            <input
              matInput
              formControlName="email"
              type="email"
              placeholder="email@example.com"
            />
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')"
              >ඊමේල් අවශ්‍යයි</mat-error
            >
            <mat-error *ngIf="form.get('email')?.hasError('email')"
              >වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න</mat-error
            >
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>මුරපදය</mat-label>
            <input
              matInput
              formControlName="password"
              [type]="hidePassword ? 'password' : 'text'"
            />
            <mat-icon matPrefix>lock</mat-icon>
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword = !hidePassword"
            >
              <mat-icon>{{
                hidePassword ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')"
              >මුරපදය අවශ්‍යයි</mat-error
            >
          </mat-form-field>

          <button
            mat-flat-button
            color="primary"
            type="submit"
            class="w-100 auth-submit-btn"
            [disabled]="loading"
          >
            <mat-spinner
              *ngIf="loading"
              diameter="20"
              class="btn-spinner"
            ></mat-spinner>
            <span *ngIf="!loading">පිවිසෙන්න</span>
          </button>
        </form>

        <div class="auth-card__footer">
          <p>ගිණුමක් නැද්ද? <a routerLink="/register">ලියාපදිංචි වන්න</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(160deg, #f6f7fb 0%, #e8eaf6 100%);
        padding: 24px;
      }
      .auth-card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        padding: 40px;
        width: 100%;
        max-width: 440px;
        border: 1px solid #e0e3eb;
      }
      .auth-card__header {
        text-align: center;
        margin-bottom: 32px;

        h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0b3d91;
          margin: 16px 0 8px;
        }
        p {
          font-size: 13px;
        }
      }
      .auth-card__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: linear-gradient(135deg, #0b3d91, #315aa7);
        cursor: pointer;

        mat-icon {
          color: #f4b400;
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }
      .auth-submit-btn {
        height: 48px !important;
        font-size: 16px;
        margin-top: 8px;
      }
      .btn-spinner {
        display: inline-block;
      }
      .auth-card__footer {
        text-align: center;
        margin-top: 24px;
        font-size: 14px;
        color: #555770;

        a {
          font-weight: 600;
        }
      }
      mat-form-field {
        margin-bottom: 4px;
      }
    `,
  ],
})
export class LoginComponent {
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.notify.success('සාර්ථකව පිවිසුණි!');
        this.redirectByRole(res.role);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        const msg =
          err.error?.message || 'පිවිසීම අසාර්ථකයි. නැවත උත්සාහ කරන්න.';
        this.notify.error(msg);
      },
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'STUDENT':
        this.router.navigate(['/student']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'SUPER_ADMIN':
        this.router.navigate(['/superadmin']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
