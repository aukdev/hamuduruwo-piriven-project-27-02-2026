import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
}

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [...SHARED_IMPORTS, SafeUrlPipe],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent {
  selectedCategory = 'all';

  categories = [
    { value: 'all', label: 'සියල්ල / All' },
    { value: 'introduction', label: 'හැඳින්වීම් / Introduction' },
    { value: 'tutorial', label: 'මාර්ගෝපදේශ / Tutorials' },
    { value: 'dhamma', label: 'ධර්ම දේශනා / Dhamma' },
    { value: 'exam', label: 'විභාග සූදානම / Exam Prep' },
  ];

  videos: Video[] = [
    {
      id: '1',
      title: 'පිරිවෙන් අධ්‍යාපනය හැඳින්වීම',
      description:
        'පිරිවෙන් අධ්‍යාපන ක්‍රමය පිළිබඳ සවිස්තරාත්මක හැඳින්වීමක්. ශ්‍රී ලංකාවේ පිරිවෙන් අධ්‍යාපනයේ ඉතිහාසය හා වැදගත්කම.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'introduction',
    },
    {
      id: '2',
      title: 'MCQ පද්ධතිය භාවිතා කරන ආකාරය',
      description:
        'පද්ධතිය භාවිතා කිරීමේ පියවරෙන් පියවර මාර්ගෝපදේශය. ලියාපදිංචි වීම, ප්‍රශ්න පත්‍ර තෝරා ගැනීම සහ විභාග ලිවීම.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'tutorial',
    },
    {
      id: '3',
      title: 'විභාග සාර්ථකත්වය සඳහා උපදෙස්',
      description:
        'විභාගයට සූදානම් වීමේ ක්‍රමවේද හා උපදෙස්. කාල කළමනාකරණය හා අධ්‍යයන ක්‍රම.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'exam',
    },
    {
      id: '4',
      title: 'බුද්ධ ධර්මය - මූලික සංකල්ප',
      description:
        'බුද්ධ ධර්මයේ මූලික සංකල්ප පිළිබඳ පැහැදිලි කිරීමක්. චතුරාර්ය සත්‍යය හා අෂ්ටාංගික මාර්ගය.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'dhamma',
    },
    {
      id: '5',
      title: 'පාලි භාෂාව - ආරම්භක පාඩම්',
      description:
        'පාලි භාෂාව ඉගෙනීම ආරම්භ කරන්නන් සඳහා මූලික පාඩම්. අක්ෂර මාලාව හා උච්චාරණය.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'tutorial',
    },
    {
      id: '6',
      title: 'විනය පිටකය - හැඳින්වීම',
      description:
        'විනය පිටකයේ අන්තර්ගතය හා වැදගත්කම පිළිබඳ සටහනක්. භික්ෂු විනය හා භික්ෂුණී විනය.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'dhamma',
    },
    {
      id: '7',
      title: 'ගුරුවරුන් සඳහා මාර්ගෝපදේශය',
      description:
        'ගුරුවරුන්ට පද්ධතිය භාවිතා කිරීම පිළිබඳ විස්තරාත්මක මාර්ගෝපදේශයක්. ප්‍රශ්න නිර්මාණය හා කළමනාකරණය.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'tutorial',
    },
    {
      id: '8',
      title: 'පිරිවෙන් ඉතිහාසය',
      description:
        'ශ්‍රී ලංකාවේ පිරිවෙන් අධ්‍යාපනයේ ඉතිහාසය හා පරිණාමය. පුරාතන කාලයේ සිට වර්තමානය දක්වා.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'introduction',
    },
    {
      id: '9',
      title: '2024 විභාග ප්‍රශ්න විශ්ලේෂණය',
      description:
        '2024 විභාගයේ ප්‍රශ්න රටා විශ්ලේෂණය හා 2025 සඳහා අපේක්ෂිත ප්‍රශ්න වර්ග.',
      youtubeId: 'dQw4w9WgXcQ',
      category: 'exam',
    },
  ];

  get filteredVideos(): Video[] {
    if (this.selectedCategory === 'all') {
      return this.videos;
    }
    return this.videos.filter((v) => v.category === this.selectedCategory);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  getCategoryLabel(category: string): string {
    return (
      this.categories.find((item) => item.value === category)?.label ?? category
    );
  }
}
