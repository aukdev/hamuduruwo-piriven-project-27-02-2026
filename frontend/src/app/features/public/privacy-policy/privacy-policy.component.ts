import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  template: `
    <div class="page">
      <section class="page-hero">
        <h1>පෞද්ගලිකත්ව ප්‍රතිපත්තිය / Privacy Policy</h1>
        <p>ඔබගේ පෞද්ගලික තොරතුරු අපි ආරක්ෂා කරන ආකාරය</p>
      </section>

      <div class="page-body">
        <div class="legal-card">
          <p class="updated">
            අවසන් යාවත්කාලීන කිරීම / Last updated: 2025-01-01
          </p>

          <section class="legal-section">
            <h2>1. තොරතුරු එකතු කිරීම / Information We Collect</h2>
            <p>
              පිරිවෙන් MCQ පද්ධතිය භාවිත කිරීමේදී අපි පහත තොරතුරු එකතු කරනු
              ලැබේ:
            </p>
            <ul>
              <li>
                <strong>ගිණුම් තොරතුරු:</strong> නම, ඊමේල් ලිපිනය, පරිශීලක
                භූමිකාව (සිසු/ගුරු)
              </li>
              <li>
                <strong>විභාග දත්ත:</strong> විභාග උත්සාහයන්, පිළිතුරු, ලකුණු,
                කාල දත්ත
              </li>
              <li>
                <strong>පද්ධති දත්ත:</strong> පිවිසුම් කාලය, උපාංග වර්ගය
                (බ්‍රවුසරය)
              </li>
            </ul>
            <p class="text-en">
              When using the Piriven MCQ System, we collect: account information
              (name, email, role), examination data (attempts, answers, scores),
              and basic system data (login times, browser type).
            </p>
          </section>

          <section class="legal-section">
            <h2>2. තොරතුරු භාවිතය / How We Use Information</h2>
            <p>එකතු කරන ලද තොරතුරු පහත කාර්යයන් සඳහා පමණක් භාවිත කරනු ලැබේ:</p>
            <ul>
              <li>ඔබට පද්ධතිය වෙත ප්‍රවේශ වීමට ඉඩ සැලසීම</li>
              <li>විභාග ලකුණු හා ප්‍රගති වාර්තා සැපයීම</li>
              <li>පද්ධතියේ ගුණාත්මකභාවය වැඩි දියුණු කිරීම</li>
              <li>ගුරුවරුන්ට සිසුන්ගේ ප්‍රගතිය නිරීක්ෂණය කිරීමට ඉඩ සැලසීම</li>
            </ul>
            <p class="text-en">
              Information is used only to provide system access, deliver
              examination scores and progress reports, improve the platform, and
              allow teachers to monitor student progress.
            </p>
          </section>

          <section class="legal-section">
            <h2>3. තොරතුරු ආරක්ෂාව / Data Security</h2>
            <p>
              ඔබගේ මුරපදය BCrypt ක්‍රමවේදයෙන් සංකේතනය කරනු ලබන අතර, JWT (JSON
              Web Token) මගින් ආරක්ෂිත සැසි කළමනාකරණය සිදු කරයි. ඔබගේ පෞද්ගලික
              තොරතුරු තෙවන පාර්ශ්වයක් සමඟ බෙදා ගන්නේ නැත.
            </p>
            <p class="text-en">
              Passwords are encrypted using BCrypt. Sessions are managed
              securely via JWT tokens. We do not share personal data with third
              parties.
            </p>
          </section>

          <section class="legal-section">
            <h2>4. ඔබේ අයිතිවාසිකම් / Your Rights</h2>
            <ul>
              <li>ඔබගේ පෞද්ගලික තොරතුරු බලා ගැනීමට අයිතිය</li>
              <li>ඔබගේ ගිණුම් තොරතුරු යාවත්කාලීන කිරීමට අයිතිය</li>
              <li>ඔබගේ ගිණුම මකා දැමීමට ඉල්ලීමේ අයිතිය</li>
            </ul>
            <p class="text-en">
              You have the right to view, update, and request deletion of your
              personal data.
            </p>
          </section>

          <section class="legal-section">
            <h2>5. සම්බන්ධ කර ගන්න / Contact</h2>
            <p>
              පෞද්ගලිකත්ව ප්‍රතිපත්තිය සම්බන්ධ ප්‍රශ්න සඳහා අපව සම්බන්ධ කරගන්න:
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
export class PrivacyPolicyComponent {}
