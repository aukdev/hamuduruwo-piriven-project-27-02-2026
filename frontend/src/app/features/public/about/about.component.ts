import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ApiService } from '../../../core/services/api.service';
import { PublicTestimonialDto } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  userTestimonials: PublicTestimonialDto[] = [];
  loadingTestimonials = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPublicTestimonials().subscribe({
      next: (data) => {
        this.userTestimonials = data;
        this.loadingTestimonials = false;
      },
      error: () => (this.loadingTestimonials = false),
    });
  }

  getPhotoUrl(t: PublicTestimonialDto): string {
    return this.api.getTestimonialPhotoUrl(t.id, true);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating || 0 }, (_, i) => i);
  }

  getEmptyStars(rating: number): number[] {
    return Array.from({ length: 5 - (rating || 0) }, (_, i) => i);
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      STUDENT: 'ශිෂ්‍යයා',
      TEACHER: 'ගුරුවරයා',
    };
    return map[role] || role;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
