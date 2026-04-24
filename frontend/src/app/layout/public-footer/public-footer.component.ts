import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDividerModule],
  templateUrl: './public-footer.component.html',
  styleUrls: ['./public-footer.component.scss'],
})
export class PublicFooterComponent implements OnInit {
  currentYear = new Date().getFullYear();

  stats = [
    { icon: 'people', value: 0, label: 'සිසුන්', labelEn: 'Students' },
    {
      icon: 'cast_for_education',
      value: 0,
      label: 'ගුරුවරුන්',
      labelEn: 'Teachers',
    },
    {
      icon: 'description',
      value: 0,
      label: 'ප්‍රශ්න පත්‍ර',
      labelEn: 'Papers',
    },
    { icon: 'menu_book', value: 0, label: 'විෂයයන්', labelEn: 'Subjects' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPublicStats().subscribe({
      next: (data) => {
        this.stats[0].value = data.studentCount;
        this.stats[1].value = data.teacherCount;
        this.stats[2].value = data.paperCount;
        this.stats[3].value = data.subjectCount;
      },
      error: () => {
        // Fallback values when API is unavailable
        this.stats[0].value = 150;
        this.stats[1].value = 25;
        this.stats[2].value = 81;
        this.stats[3].value = 5;
      },
    });
  }
}
