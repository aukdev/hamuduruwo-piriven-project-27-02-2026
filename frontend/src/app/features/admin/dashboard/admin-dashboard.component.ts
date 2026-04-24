import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, SkeletonComponent, PageHeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  pendingCount = 0;
  userCount = 0;
  subjectCount = 0;
  loading = true;
  private loadCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPendingQuestions(0, 1).subscribe({
      next: (r) => {
        this.pendingCount = r.totalElements;
        this.checkLoaded();
      },
      error: () => this.checkLoaded(),
    });
    this.api.getUsers(0, 1).subscribe({
      next: (r) => {
        this.userCount = r.totalElements;
        this.checkLoaded();
      },
      error: () => this.checkLoaded(),
    });
    this.api.getSubjects().subscribe({
      next: (s) => {
        this.subjectCount = s.length;
        this.checkLoaded();
      },
      error: () => this.checkLoaded(),
    });
  }

  private checkLoaded(): void {
    this.loadCount++;
    if (this.loadCount >= 3) this.loading = false;
  }
}
