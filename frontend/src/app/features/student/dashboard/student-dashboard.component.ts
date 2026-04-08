import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TestimonialFormDialogComponent } from '../../../shared/components/testimonial-form-dialog/testimonial-form-dialog.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, SkeletonComponent, PageHeaderComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  user: CurrentUser | null = null;
  showTestimonialBanner = false;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private dialog: MatDialog,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;
    this.api.getTestimonialStatus().subscribe({
      next: (status) => {
        this.showTestimonialBanner =
          status.isFormEnabled && !status.isSubmitted;
      },
    });
  }

  openTestimonialForm(): void {
    const ref = this.dialog.open(TestimonialFormDialogComponent, {
      width: '520px',
    });
    ref.afterClosed().subscribe((submitted) => {
      if (submitted) this.showTestimonialBanner = false;
    });
  }
}
