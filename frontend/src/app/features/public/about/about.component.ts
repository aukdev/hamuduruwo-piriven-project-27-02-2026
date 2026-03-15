import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="page">
      <!-- Hero Banner -->
      <section class="page-hero">
        <h1>අපි ගැන / About Us</h1>
        <p>පිරිවෙන් MCQ පද්ධතිය පිළිබඳව දැන ගන්න</p>
      </section>

      <div class="page-body">
        <!-- What is this -->
        <section class="section">
          <div class="section__content">
            <h2>පිරිවෙන් MCQ පද්ධතිය යනු කුමක්ද?</h2>
            <h3>What is Piriven MCQ System?</h3>
            <p>
              පිරිවෙන් MCQ පද්ධතිය ශ්‍රී ලංකා රජයේ පිරිවෙන් පාසල් සඳහා විශේෂයෙන්
              නිර්මාණය කරන ලද ඩිජිටල් බහුවරණ ප්‍රශ්න (MCQ) පුහුණු වේදිකාවකි.
              2017 සිට 2025 දක්වා අතීත විභාග ප්‍රශ්න පත්‍ර මෙම පද්ධතිය හරහා
              සිසුන්ට ඕනෑම වේලාවක, ඕනෑම තැනක පුහුණු වීමට හැකියාව ලබා දෙයි.
            </p>
            <p class="text-en">
              The Piriven MCQ System is a digital multiple-choice question
              practice platform specially designed for Sri Lankan Government
              Pirivena schools. It provides students access to past examination
              papers from 2017 to 2025, allowing them to practice anytime and
              anywhere.
            </p>
          </div>
          <div class="section__image">
            <img
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80"
              alt="Education"
              loading="lazy"
            />
          </div>
        </section>

        <!-- Who is it for -->
        <section class="section section--reverse">
          <div class="section__content">
            <h2>මෙය කාට සඳහාද?</h2>
            <h3>Who Is It For?</h3>
            <div class="audience-cards">
              <div class="audience-card">
                <mat-icon>school</mat-icon>
                <h4>සිසුන් / Students</h4>
                <p>
                  අතීත ප්‍රශ්න පත්‍ර හා කාලගත විභාග මගින් පුහුණුව ලබා ගම්න විභාග
                  සූදානම වැඩි දියුණු කර ගත හැක.
                </p>
              </div>
              <div class="audience-card">
                <mat-icon>cast_for_education</mat-icon>
                <h4>ගුරුවරුන් / Teachers</h4>
                <p>
                  ප්‍රශ්න සාදා, ප්‍රශ්න පත්‍ර කළමනාකරණය කර, සිසුන්ගේ ප්‍රගතිය
                  නිරීක්ෂණය කළ හැක.
                </p>
              </div>
              <div class="audience-card">
                <mat-icon>admin_panel_settings</mat-icon>
                <h4>පරිපාලකයින් / Administrators</h4>
                <p>
                  පද්ධතිය කළමනාකරණය කිරීම, ප්‍රශ්න අනුමත කිරීම, පරිශීලකයින්
                  කළමනාකරණය කිරීම.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Our Purpose -->
        <section class="section">
          <div class="section__content section__content--full">
            <h2>අපේ අරමුණ / Our Purpose</h2>
            <p>
              පිරිවෙන් අධ්‍යාපනය ශ්‍රී ලංකාවේ සංස්කෘතික උරුමයේ අත්‍යවශ්‍ය
              කොටසකි. නුතන තාක්ෂණය භාවිතා කරමින් මෙම සම්භාව්‍ය අධ්‍යාපන ක්‍රමය
              ශක්තිමත් කිරීම හා සිසුන්ට වඩා හොඳ විභාග ප්‍රතිඵල ලබා ගැනීමට උදවු
              කිරීම අපගේ ප්‍රධාන අරමුණයි.
            </p>
            <p class="text-en">
              Pirivena education is an essential part of Sri Lanka's cultural
              heritage. Our primary purpose is to strengthen this classical
              education system using modern technology, helping students achieve
              better examination results.
            </p>
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
        max-width: 1100px;
        margin: 0 auto;
        padding: 60px 24px 80px;
      }
      .section {
        display: flex;
        align-items: center;
        gap: 48px;
        margin-bottom: 64px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .section--reverse {
        flex-direction: row-reverse;
      }
      .section__content {
        flex: 1;
        h2 {
          font-size: 24px;
          font-weight: 800;
          color: #0b3d91;
          margin-bottom: 4px;
        }
        h3 {
          font-size: 14px;
          color: #888;
          margin-bottom: 16px;
        }
        p {
          font-size: 14px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 12px;
        }
      }
      .section__content--full {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      .text-en {
        font-size: 13px !important;
        color: #777 !important;
        font-style: italic;
      }
      .section__image {
        flex: 0 0 360px;
        img {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          object-fit: cover;
          height: 280px;
        }
      }
      .audience-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 20px;
      }
      .audience-card {
        background: #f8f9fc;
        border-radius: 12px;
        padding: 24px 20px;
        border: 1px solid #e8eaf0;
        mat-icon {
          color: #0b3d91;
          font-size: 28px;
          width: 28px;
          height: 28px;
          margin-bottom: 10px;
        }
        h4 {
          font-size: 14px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
        }
        p {
          font-size: 12px;
          line-height: 1.7;
          color: #555770;
        }
      }
      @media (max-width: 768px) {
        .page-hero h1 {
          font-size: 28px;
        }
        .section {
          flex-direction: column !important;
          gap: 24px;
        }
        .section__image {
          flex: 0 0 auto;
          width: 100%;
        }
        .audience-cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AboutComponent {}
