import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { QuestionDto } from '../../../core/models';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, SkeletonComponent, PageHeaderComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
})
export class TeacherDashboardComponent implements OnInit {
  stats = [
    {
      icon: 'edit_note',
      label: 'කෙටුම්පත්',
      count: 0,
      bg: 'rgba(0, 109, 119, 0.06)',
      color: '#003d46',
    },
    {
      icon: 'pending',
      label: 'සමාලෝචනයට',
      count: 0,
      bg: 'rgba(244,180,0,0.15)',
      color: '#e65100',
    },
    {
      icon: 'check_circle',
      label: 'අනුමත',
      count: 0,
      bg: 'rgba(46,125,50,0.1)',
      color: '#2e7d32',
    },
    {
      icon: 'cancel',
      label: 'ප්‍රතික්ෂේප',
      count: 0,
      bg: 'rgba(198,40,40,0.1)',
      color: '#c62828',
    },
  ];

  loading = true;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getMyQuestions(0, 100).subscribe({
      next: (res) => {
        const questions = res.content;
        this.stats[0].count = questions.filter(
          (q) => q.status === 'DRAFT',
        ).length;
        this.stats[1].count = questions.filter(
          (q) => q.status === 'PENDING_REVIEW',
        ).length;
        this.stats[2].count = questions.filter(
          (q) => q.status === 'APPROVED',
        ).length;
        this.stats[3].count = questions.filter(
          (q) => q.status === 'REJECTED',
        ).length;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
