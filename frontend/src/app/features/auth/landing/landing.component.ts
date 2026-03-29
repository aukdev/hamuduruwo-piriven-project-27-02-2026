import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  features = [
    {
      icon: 'quiz',
      color: '#0B3D91',
      bg: 'rgba(11, 61, 145, 0.08)',
      title: 'past-paper ප්‍රශ්න පත්‍ර',
      titleEn: 'Past Papers',
      desc: '2017 සිට 2025 දක්වා past-paper ප්‍රශ්න පත්‍ර 81ක් පුහුණුව සඳහා ලබා ගත හැක.',
    },
    {
      icon: 'timer',
      color: '#F4B400',
      bg: 'rgba(244, 180, 0, 0.1)',
      title: 'කාලගත විභාග',
      titleEn: 'Timed Exams',
      desc: 'සැබෑ විභාග පරිසරයක් — ප්‍රශ්නයකට තත්පර 30ක් | මුළු මිනිත්තු 20ක්.',
    },
    {
      icon: 'trending_up',
      color: '#2e7d32',
      bg: 'rgba(46, 125, 50, 0.08)',
      title: 'ප්‍රගති නිරීක්ෂණය',
      titleEn: 'Progress Tracking',
      desc: 'ඔබේ ලකුණු, දුර්වල ක්ෂේත්‍ර හා දියුණුව පිළිබඳ සම්පූර්ණ විශ්ලේෂණයක් ලබා ගන්න.',
    },
    {
      icon: 'admin_panel_settings',
      color: '#7b1fa2',
      bg: 'rgba(123, 31, 162, 0.08)',
      title: 'භූමිකා පාදක පිවිසුම',
      titleEn: 'Role-Based Access',
      desc: 'සිසුන්, ගුරුවරුන්, පරිපාලකයින් සඳහා වෙන් වෙන් පරිශීලක පුවරු.',
    },
    {
      icon: 'menu_book',
      color: '#e65100',
      bg: 'rgba(230, 81, 0, 0.08)',
      title: 'විෂය පුළුල් ආවරණය',
      titleEn: 'Subject Coverage',
      desc: 'පාලි, සංස්කෘත, බුද්ධ ධර්මය, සිංහල ඇතුළු විෂයයන් 5ක් ආවරණය කරයි.',
    },
    {
      icon: 'devices',
      color: '#00838f',
      bg: 'rgba(0, 131, 143, 0.08)',
      title: 'ඕනෑම උපාංගයකින්',
      titleEn: 'Any Device',
      desc: 'පරිගණකය, ටැබ්ලටය හෝ දුරකථනය — ඕනෑම උපාංගයකින් ප්‍රවේශ විය හැක.',
    },
  ];

  steps = [
    {
      icon: 'person_add',
      title: 'ලියාපදිංචි වන්න',
      titleEn: 'Register',
      desc: 'නොමිලේ ගිණුමක් සාදා ඔබේ භූමිකාව තෝරන්න — සිසුවෙක් හෝ ගුරුවරයෙක්.',
    },
    {
      icon: 'touch_app',
      title: 'ප්‍රශ්න පත්‍රය තෝරන්න',
      titleEn: 'Select a Paper',
      desc: 'වර්ෂය හා විෂය අනුව ප්‍රශ්න පත්‍ර බලා ඔබට අවශ්‍ය එක තෝරන්න.',
    },
    {
      icon: 'emoji_events',
      title: 'විභාගය කරන්න',
      titleEn: 'Take the Exam',
      desc: 'කාලය ගත වන විභාගය සම්පූර්ණ කර ක්ෂණික ලකුණු ලබා ගන්න.',
    },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    if (this.auth.isAuthenticated) {
      this.auth.navigateByRole();
    }
  }
}
