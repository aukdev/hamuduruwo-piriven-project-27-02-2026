import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-card__header">
          <div class="auth-card__logo" routerLink="/">
            <mat-icon>school</mat-icon>
          </div>
          <h1>ලියාපදිංචිය</h1>
          <p class="text-muted">නව ගිණුමක් සාදන්න / Create a new account</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>සම්පූර්ණ නම</mat-label>
            <input
              matInput
              formControlName="fullName"
              placeholder="ඔබේ නම ඇතුළත් කරන්න"
            />
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="form.get('fullName')?.hasError('required')"
              >නම අවශ්‍යයි</mat-error
            >
            <mat-error *ngIf="form.get('fullName')?.hasError('minlength')"
              >අවම අකුරු 2ක් ඇතුළත් කරන්න</mat-error
            >
          </mat-form-field>

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
              >වලංගු ඊමේල් ලිපිනයක්</mat-error
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
            <mat-error *ngIf="form.get('password')?.hasError('minlength')"
              >අවම අකුරු 8ක්</mat-error
            >
          </mat-form-field>

          <div class="role-selection">
            <label class="role-label">භූමිකාව තෝරන්න (Select Role)</label>
            <mat-radio-group formControlName="role" class="role-group">
              <div
                class="role-option"
                [class.selected]="form.get('role')?.value === 'STUDENT'"
                (click)="form.get('role')?.setValue('STUDENT')"
              >
                <mat-radio-button value="STUDENT"></mat-radio-button>
                <div class="role-option__info">
                  <mat-icon>school</mat-icon>
                  <div>
                    <strong>ශිෂ්‍යයා / Student</strong>
                    <small>විභාග සඳහා</small>
                  </div>
                </div>
              </div>
              <div
                class="role-option"
                [class.selected]="form.get('role')?.value === 'TEACHER'"
                (click)="form.get('role')?.setValue('TEACHER')"
              >
                <mat-radio-button value="TEACHER"></mat-radio-button>
                <div class="role-option__info">
                  <mat-icon>assignment_ind</mat-icon>
                  <div>
                    <strong>ගුරුවරයා / Teacher</strong>
                    <small>ප්‍රශ්න සාදන්න</small>
                  </div>
                </div>
              </div>
            </mat-radio-group>
            <mat-error
              *ngIf="
                form.get('role')?.touched &&
                form.get('role')?.hasError('required')
              "
              style="font-size:12px; margin-top:4px;"
            >
              භූමිකාව තෝරන්න
            </mat-error>
          </div>

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
            <span *ngIf="!loading">ලියාපදිංචි වන්න</span>
          </button>
        </form>

        <div class="auth-card__footer">
          <p>දැනටමත් ගිණුමක් තිබේද? <a routerLink="/login">පිවිසෙන්න</a></p>
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
        max-width: 480px;
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
      .role-selection {
        margin-bottom: 20px;
      }
      .role-label {
        font-size: 13px;
        font-weight: 600;
        color: #555770;
        margin-bottom: 8px;
        display: block;
      }
      .role-group {
        display: flex;
        gap: 12px;
      }
      .role-option {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border: 2px solid #e0e3eb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          border-color: #0b3d91;
        }
        &.selected {
          border-color: #0b3d91;
          background: rgba(11, 61, 145, 0.04);
        }
      }
      .role-option__info {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          color: #0b3d91;
          font-size: 24px;
        }
        strong {
          font-size: 13px;
          display: block;
          color: #1a1a2e;
        }
        small {
          font-size: 11px;
          color: #555770;
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

      @media (max-width: 480px) {
        .role-group {
          flex-direction: column;
        }
      }
    `,
  ],
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
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.notify.success('ලියාපදිංචිය සාර්ථකයි!');
        this.redirectByRole(res.role);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        const msg = err.error?.message || 'ලියාපදිංචිය අසාර්ථකයි.';
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
      default:
        this.router.navigate(['/']);
    }
  }
}
