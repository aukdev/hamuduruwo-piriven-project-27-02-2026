import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { ApiService } from '../../../core/services/api.service';
import { AttemptResultResponse } from '../../../core/models';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [...SHARED_IMPORTS, LoadingOverlayComponent, SkeletonComponent],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  result: AttemptResultResponse | null = null;
  loading = true;
  scorePercent = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    const attemptId = this.route.snapshot.params['attemptId'];
    this.api.getAttemptResult(attemptId).subscribe({
      next: (res) => {
        this.result = res;
        this.scorePercent = (res.score / res.totalQuestions) * 100;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getStatusSinhala(status: string): string {
    const map: Record<string, string> = {
      SUBMITTED: 'ඉදිරිපත් කළ',
      EXPIRED: 'කල් ඉකුත්',
      IN_PROGRESS: 'සිදු වෙමින්',
    };
    return map[status] || status;
  }

  goBack(): void {
    if (this.result) {
      this.router.navigate(['/student/years', this.result.year, 'papers']);
    } else {
      this.router.navigate(['/student/years']);
    }
  }
}
