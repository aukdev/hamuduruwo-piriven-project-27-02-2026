import { Component } from '@angular/core';

@Component({
  selector: 'app-vision-mission',
  template: `
    <div class="page">
      <section class="page-hero">
        <h1>දැක්ම හා මෙහෙවර / Vision & Mission</h1>
        <p>අපගේ අරමුණු හා ප්‍රතිඥාව</p>
      </section>

      <div class="page-body">
        <!-- Vision -->
        <section class="vm-card vm-card--vision">
          <div class="vm-card__icon">
            <mat-icon>visibility</mat-icon>
          </div>
          <h2>දැක්ම / Vision</h2>
          <blockquote>
            ශ්‍රී ලංකාවේ පිරිවෙන් අධ්‍යාපනය ඩිජිටල් තාක්ෂණය මගින් ශක්තිමත් කර,
            සෑම සිසුවෙකුටම ගුණාත්මක විභාග පුහුණුවක් ලබා දීම.
          </blockquote>
          <p class="text-en">
            To strengthen Pirivena education in Sri Lanka through digital
            technology, providing quality examination practice to every student.
          </p>
        </section>

        <!-- Mission -->
        <section class="vm-card vm-card--mission">
          <div class="vm-card__icon">
            <mat-icon>flag</mat-icon>
          </div>
          <h2>මෙහෙවර / Mission</h2>
          <blockquote>
            නුතන තාක්ෂණය හා සම්භාව්‍ය පිරිවෙන් අධ්‍යාපනය සම්බන්ධ කරමින්,
            සිසුන්ට, ගුරුවරුන්ට හා පරිපාලකයින්ට ඉතා පහසු, විශ්වසනීය හා ඵලදායී
            MCQ පුහුණු පද්ධතියක් ලබා දීම.
          </blockquote>
          <p class="text-en">
            To provide an easy, reliable, and effective MCQ practice system for
            students, teachers, and administrators by combining modern
            technology with classical Pirivena education.
          </p>
        </section>

        <!-- Core Values -->
        <section class="values">
          <h2 class="values__title">මූලික වටිනාකම් / Core Values</h2>
          <div class="values__grid">
            <div class="value-card" *ngFor="let v of values">
              <div class="value-card__icon" [style.background]="v.bg">
                <mat-icon [style.color]="v.color">{{ v.icon }}</mat-icon>
              </div>
              <h3>{{ v.title }}</h3>
              <p class="value-card__title-en">{{ v.titleEn }}</p>
              <p>{{ v.desc }}</p>
            </div>
          </div>
        </section>
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
        max-width: 900px;
        margin: 0 auto;
        padding: 60px 24px 80px;
      }
      .vm-card {
        background: #fff;
        border-radius: 16px;
        padding: 40px;
        margin-bottom: 32px;
        border: 1px solid #e8eaf0;
        text-align: center;
      }
      .vm-card__icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .vm-card--vision .vm-card__icon {
        background: rgba(11, 61, 145, 0.08);
        mat-icon {
          color: #0b3d91;
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
      }
      .vm-card--mission .vm-card__icon {
        background: rgba(244, 180, 0, 0.1);
        mat-icon {
          color: #f4b400;
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
      }
      .vm-card h2 {
        font-size: 22px;
        font-weight: 800;
        color: #0b3d91;
        margin-bottom: 16px;
      }
      .vm-card blockquote {
        font-size: 16px;
        line-height: 1.9;
        color: #333;
        margin: 0 0 12px;
        padding: 0;
        border: none;
        font-weight: 500;
      }
      .text-en {
        font-size: 13px;
        color: #888;
        font-style: italic;
      }
      .values {
        margin-top: 48px;
      }
      .values__title {
        font-size: 24px;
        font-weight: 800;
        color: #0b3d91;
        text-align: center;
        margin-bottom: 32px;
      }
      .values__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      .value-card {
        background: #fff;
        border-radius: 14px;
        padding: 28px 24px;
        border: 1px solid #e8eaf0;
        text-align: center;
      }
      .value-card__icon {
        width: 50px;
        height: 50px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 14px;
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
      .value-card h3 {
        font-size: 15px;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 2px;
      }
      .value-card__title-en {
        font-size: 11px;
        color: #999;
        margin-bottom: 8px;
      }
      .value-card p:last-child {
        font-size: 13px;
        line-height: 1.7;
        color: #555770;
      }
      @media (max-width: 768px) {
        .page-hero h1 {
          font-size: 28px;
        }
        .vm-card {
          padding: 28px 20px;
        }
        .values__grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class VisionMissionComponent {
  values = [
    {
      icon: 'school',
      color: '#0b3d91',
      bg: 'rgba(11, 61, 145, 0.08)',
      title: 'ශ්‍රේෂ්ඨත්වය',
      titleEn: 'Excellence',
      desc: 'ඉහළම ගුණාත්මක අධ්‍යාපනික අන්තර්ගතය සැපයීම.',
    },
    {
      icon: 'handshake',
      color: '#2e7d32',
      bg: 'rgba(46, 125, 50, 0.08)',
      title: 'සමානාත්මතාවය',
      titleEn: 'Equality',
      desc: 'සෑම සිසුවෙකුටම සමාන අවස්ථාවක් ලබා දීම.',
    },
    {
      icon: 'lightbulb',
      color: '#f4b400',
      bg: 'rgba(244, 180, 0, 0.1)',
      title: 'නවෝත්පාදනය',
      titleEn: 'Innovation',
      desc: 'නුතන තාක්ෂණය භාවිතා කර අධ්‍යාපනය වැඩි දියුණු කිරීම.',
    },
    {
      icon: 'diversity_3',
      color: '#7b1fa2',
      bg: 'rgba(123, 31, 162, 0.08)',
      title: 'සංස්කෘතික සංරක්ෂණය',
      titleEn: 'Cultural Preservation',
      desc: 'පිරිවෙන් සම්ප්‍රදාය හා බෞද්ධ සංස්කෘතිය ආරක්ෂා කිරීම.',
    },
  ];
}
