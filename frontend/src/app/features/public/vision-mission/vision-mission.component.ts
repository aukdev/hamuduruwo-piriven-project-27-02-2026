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

  testimonials = [
    {
      name: 'පූජ්‍ය ආචාර්ය සුනන්ද හිමි',
      position: 'අධ්‍යාපන අධ්‍යක්ෂ',
      positionEn: 'Director of Education',
      organization: 'පිරිවෙන් අධ්‍යාපන අමාත්‍යාංශය',
      quote:
        'මෙම MCQ පද්ධතිය පිරිවෙන් අධ්‍යාපනයේ නව මාවතක් විවෘත කරයි. අපගේ සිසුන්ට ඉතා පහසුවෙන් විභාග පුහුණුව ලබාගැනීමට මෙය ඉතා වටිනා මෙවලමකි. තාක්ෂණය හා සම්භාව්‍ය අධ්‍යාපනය මනාසේ එකට බද්ධ වී ඇත.',
      avatar: 'S',
    },
    {
      name: 'පූජ්‍ය ධම්මානන්ද හිමි',
      position: 'නියෝජ්‍ය අධ්‍යාපන අධ්‍යක්ෂ',
      positionEn: 'Deputy Director of Education',
      organization: 'බස්නාහිර පළාත් පිරිවෙන් අධ්‍යාපන දෙපාර්තමේන්තුව',
      quote:
        'සාම්ප්‍රදායික පිරිවෙන් අධ්‍යාපනය නවීන තාක්ෂණය සමඟ සම්බන්ධ කිරීම ඉතා වැදගත් පියවරකි. මෙම පද්ධතිය පිරිවෙන් සිසුන්ගේ විභාග සාර්ථකත්වය වැඩි කිරීමට සැලකිය යුතු ලෙස දායක වනු ඇත.',
      avatar: 'D',
    },
    {
      name: 'පූජ්‍ය රාහුල හිමි',
      position: 'පිරිවෙන් පරිපාලන නිලධාරී',
      positionEn: 'Pirivena Administrative Officer',
      organization: 'ජාතික පිරිවෙන් සම්මේලනය',
      quote:
        'ගුරුවරුන්ට හා පරිපාලකයින්ට ප්‍රශ්න කළමනාකරණය, ප්‍රගති නිරීක්ෂණය ඉතා පහසු වී ඇත. මෙම පද්ධතිය ක්‍රියාත්මක කිරීම සඳහා සහය දීම ගැන සතුටුදායකය.',
      avatar: 'R',
    },
  ];
}
