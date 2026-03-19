import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';

@Component({
  selector: 'app-vision-mission',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './vision-mission.component.html',
  styleUrls: ['./vision-mission.component.scss'],
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
