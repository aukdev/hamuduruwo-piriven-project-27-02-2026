import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="page">
      <section class="page-hero">
        <h1>සම්බන්ධ වන්න / Contact Us</h1>
        <p>ඔබේ ගැටළු හෝ යෝජනා අප වෙත දන්වන්න</p>
      </section>

      <div class="page-body">
        <div class="contact-grid">
          <!-- Contact Info Cards -->
          <div class="info-section">
            <div class="info-card">
              <div class="info-card__icon">
                <mat-icon>email</mat-icon>
              </div>
              <h3>ඊමේල් / Email</h3>
              <p>info&#64;pirivenmcq.lk</p>
              <p class="text-muted">support&#64;pirivenmcq.lk</p>
            </div>
            <div class="info-card">
              <div class="info-card__icon">
                <mat-icon>phone</mat-icon>
              </div>
              <h3>දුරකථන / Phone</h3>
              <p>+94 11 234 5678</p>
              <p class="text-muted">සඳුදා - සිකුරාදා, පෙ.ව 8 - ප.ව 5</p>
            </div>
            <div class="info-card">
              <div class="info-card__icon">
                <mat-icon>location_on</mat-icon>
              </div>
              <h3>ලිපිනය / Address</h3>
              <p>අධ්‍යාපන අමාත්‍යාංශය</p>
              <p class="text-muted">"ඉසුරුපාය", බත්තරමුල්ල, ශ්‍රී ලංකාව</p>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="form-section">
            <h2>පණිවිඩයක් යවන්න / Send a Message</h2>
            <form class="contact-form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>ඔබේ නම / Your Name</mat-label>
                <input matInput [(ngModel)]="form.name" name="name" required />
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>ඊමේල් / Email</mat-label>
                <input
                  matInput
                  type="email"
                  [(ngModel)]="form.email"
                  name="email"
                  required
                />
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>විෂය / Subject</mat-label>
                <input matInput [(ngModel)]="form.subject" name="subject" />
                <mat-icon matPrefix>subject</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>පණිවිඩය / Message</mat-label>
                <textarea
                  matInput
                  rows="5"
                  [(ngModel)]="form.message"
                  name="message"
                  required
                ></textarea>
                <mat-icon matPrefix>message</mat-icon>
              </mat-form-field>

              <button
                mat-flat-button
                color="primary"
                type="submit"
                class="submit-btn"
                *ngIf="!submitted"
              >
                <mat-icon>send</mat-icon>
                පණිවිඩය යවන්න / Send
              </button>
              <div class="success-msg" *ngIf="submitted">
                <mat-icon>check_circle</mat-icon>
                <p>ඔබේ පණිවිඩය සාර්ථකව යවන ලදී. ස්තුතියි!</p>
                <p class="text-en">
                  Your message has been sent successfully. Thank you!
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-hero {
        background: linear-gradient(135deg, #0b3d91, #152e6e);
        padding: 60px 24px 48px;
        text-align: center;
        h1 {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }
        p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .page-body {
        max-width: 1100px;
        margin: 0 auto;
        padding: 60px 24px 80px;
      }
      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 48px;
        align-items: start;
      }
      .info-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .info-card {
        background: #fff;
        border-radius: 14px;
        padding: 24px;
        border: 1px solid #e8eaf0;
        display: flex;
        flex-direction: column;
      }
      .info-card__icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(11, 61, 145, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        mat-icon {
          color: #0b3d91;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
      .info-card h3 {
        font-size: 15px;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 6px;
      }
      .info-card p {
        font-size: 13px;
        color: #444;
        margin-bottom: 2px;
      }
      .text-muted {
        color: #888 !important;
        font-size: 12px !important;
      }
      .form-section {
        background: #fff;
        border-radius: 16px;
        padding: 32px;
        border: 1px solid #e8eaf0;
        h2 {
          font-size: 20px;
          font-weight: 700;
          color: #0b3d91;
          margin-bottom: 24px;
        }
      }
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 4px;
        mat-form-field {
          width: 100%;
        }
      }
      .submit-btn {
        height: 48px;
        font-size: 14px;
        mat-icon {
          margin-right: 6px;
        }
      }
      .success-msg {
        text-align: center;
        padding: 24px;
        background: rgba(46, 125, 50, 0.06);
        border-radius: 12px;
        mat-icon {
          color: #2e7d32;
          font-size: 40px;
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
        }
        p {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
      }
      .text-en {
        font-size: 12px !important;
        color: #888 !important;
      }
      @media (max-width: 768px) {
        .page-hero h1 {
          font-size: 28px;
        }
        .contact-grid {
          grid-template-columns: 1fr;
          gap: 32px;
        }
      }
    `,
  ],
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
