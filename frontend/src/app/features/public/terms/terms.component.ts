import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  template: `
    <div class="page">
      <section class="page-hero">
        <h1>නියම හා කොන්දේසි / Terms & Conditions</h1>
        <p>පද්ධතිය භාවිතා කිරීමේ නියම හා කොන්දේසි</p>
      </section>

      <div class="page-body">
        <div class="legal-card">
          <p class="updated">
            අවසන් යාවත්කාලීන කිරීම / Last updated: 2025-01-01
          </p>

          <section class="legal-section">
            <h2>1. පද්ධතිය භාවිතය / System Usage</h2>
            <p>
              පිරිවෙන් MCQ පද්ධතිය ශ්‍රී ලංකා රජයේ පිරිවෙන් පාසල් වල සිසුන් හා
              ගුරුවරුන් සඳහා නිර්මාණය කරන ලද අධ්‍යාපනික වේදිකාවකි. මෙම පද්ධතිය
              අධ්‍යාපනික අරමුණු සඳහා පමණක් භාවිත කළ යුතුය.
            </p>
            <p class="text-en">
              The Piriven MCQ System is an educational platform designed for
              students and teachers of Sri Lankan Government Pirivena schools.
              It must be used for educational purposes only.
            </p>
          </section>

          <section class="legal-section">
            <h2>2. ගිණුම් නිර්මාණය / Account Creation</h2>
            <ul>
              <li>ලියාපදිංචි වීමට වලංගු ඊමේල් ලිපිනයක් අවශ්‍ය වේ.</li>
              <li>ඔබේ ගිණුම් තොරතුරු නිවැරදි හා යාවත්කාලීන විය යුතුය.</li>
              <li>ගිණුම් මුරපදය රහසිගත ලෙස තබා ගැනීම ඔබේ වගකීමකි.</li>
              <li>ගුරුවරුන්ගේ ගිණුම් පරිපාලක අනුමැතියට යටත් වේ.</li>
            </ul>
            <p class="text-en">
              Registration requires a valid email. Keep your account information
              accurate and your password confidential. Teacher accounts require
              administrator verification.
            </p>
          </section>

          <section class="legal-section">
            <h2>3. විභාග නීති / Examination Rules</h2>
            <ul>
              <li>එක ප්‍රශ්න පත්‍රයකට උපරිම උත්සාහ 10ක් ලබා ගත හැක.</li>
              <li>සෑම ප්‍රශ්නයකටම තත්පර 30ක කාල සීමාවක් ඇත.</li>
              <li>මුළු ප්‍රශ්න පත්‍රයට මිනිත්තු 20ක කාල සීමාවක් ඇත.</li>
              <li>කාල සීමාව ඉක්මවූ විට ප්‍රශ්නය නොපිළිතුරු ලෙස සලකනු ලැබේ.</li>
              <li>විභාගය ආරම්භ කළ පසු පසුබට යාම සිදු නොකළ හැක.</li>
            </ul>
            <p class="text-en">
              Maximum 10 attempts per paper. 30 seconds per question, 20 minutes
              total. Expired questions are marked unanswered. No going back once
              started.
            </p>
          </section>

          <section class="legal-section">
            <h2>4. ඉඩ නොදෙන ක්‍රියා / Prohibited Actions</h2>
            <ul>
              <li>වෙනත් පුද්ගලයෙකුගේ ගිණුම භාවිතා කිරීම.</li>
              <li>පද්ධතියේ ආරක්ෂක ක්‍රම බිඳ දැමීමට උත්සාහ කිරීම.</li>
              <li>අන්තර්ගතය අනවසරයෙන් පිටපත් කිරීම හෝ බෙදා හැරීම.</li>
              <li>පද්ධතියේ සාමාන්‍ය ක්‍රියාකාරිත්වයට බාධා කිරීම.</li>
            </ul>
            <p class="text-en">
              Do not: use others' accounts, attempt to breach security,
              copy/distribute content without authorization, or interfere with
              system operations.
            </p>
          </section>

          <section class="legal-section">
            <h2>5. ගිණුම අවලංගු කිරීම / Account Termination</h2>
            <p>
              ඉහත කොන්දේසි උල්ලංඝනය කිරීම ඔබේ ගිණුම අවට්‍ය කිරීමට හෝ ස්ථිරවම මකා
              දැමීමට පරිපාලකයින්ට අයිතිය ලබා දේ.
            </p>
            <p class="text-en">
              Violation of these terms may result in account deactivation or
              permanent deletion.
            </p>
          </section>

          <section class="legal-section">
            <h2>6. වගකීම් සීමාව / Limitation of Liability</h2>
            <p>
              පද්ධතිය "ඇති ආකාරයෙන්" සපයනු ලැබේ. අපි හැකි උපරිමයෙන් පද්ධතිය
              නිවැරදි හා ලබා ගත හැකි ලෙස පවත්වා ගැනීමට උත්සාහ කරන නමුත්, කිසිදු
              ආකාරයක වගකීමක් බාර නොගනිමු.
            </p>
            <p class="text-en">
              The system is provided "as is." We strive for accuracy and
              availability but assume no liability.
            </p>
          </section>

          <section class="legal-section">
            <h2>7. සම්බන්ධ කර ගන්න / Contact</h2>
            <p>
              නියම හා කොන්දේසි පිළිබඳ ප්‍රශ්න සඳහා:
              <a routerLink="/contact">සම්බන්ධ වන්න / Contact Us</a>
            </p>
          </section>
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
          font-size: 32px;
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
        max-width: 860px;
        margin: 0 auto;
        padding: 48px 24px 80px;
      }
      .legal-card {
        background: #fff;
        border-radius: 16px;
        padding: 40px;
        border: 1px solid #e8eaf0;
      }
      .updated {
        font-size: 12px;
        color: #888;
        margin-bottom: 32px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
      }
      .legal-section {
        margin-bottom: 32px;
        h2 {
          font-size: 17px;
          font-weight: 700;
          color: #0b3d91;
          margin-bottom: 12px;
        }
        p {
          font-size: 14px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 10px;
        }
        ul {
          padding-left: 20px;
          margin: 10px 0;
          li {
            font-size: 14px;
            line-height: 1.8;
            color: #444;
            margin-bottom: 6px;
          }
        }
        a {
          color: #0b3d91;
          font-weight: 600;
        }
      }
      .text-en {
        font-size: 13px !important;
        color: #888 !important;
        font-style: italic;
      }
      @media (max-width: 768px) {
        .page-hero h1 {
          font-size: 24px;
        }
        .legal-card {
          padding: 24px 20px;
        }
      }
    `,
  ],
})
export class TermsComponent {}
