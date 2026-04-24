import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-years',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss'],
})
export class YearsComponent implements OnInit {
  years: number[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getYears().subscribe({
      next: (years) => {
        this.years = years.sort((a, b) => b - a);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  selectYear(year: number): void {
    this.router.navigate(['/student/years', year, 'papers']);
  }
}
