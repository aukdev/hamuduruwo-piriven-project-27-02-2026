import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, SkeletonComponent, PageHeaderComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  user: CurrentUser | null = null;

  constructor(
    private auth: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;
  }
}
