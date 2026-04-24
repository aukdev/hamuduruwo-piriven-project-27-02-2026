import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  StudentAttemptSummaryDto,
  AttemptDetailDto,
  AttemptAnswerDetailDto,
  PagedResponse,
  PaperDto,
  UserDto,
} from '../../../core/models';

@Component({
  selector: 'app-student-answers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    LoadingOverlayComponent,
    EmptyStateComponent,
  ],
  templateUrl: './student-answers.component.html',
  styleUrls: ['./student-answers.component.scss'],
})
export class StudentAnswersComponent implements OnInit {
  loading = false;
  attempts: StudentAttemptSummaryDto[] = [];
  selectedAttempt: AttemptDetailDto | null = null;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;

  // Filters
  years: number[] = [];
  papers: PaperDto[] = [];
  selectedYear: number | null = null;
  selectedPaperId: string | null = null;
  selectedPaperType: string | null = null;
  private isTeacher = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService,
  ) {
    this.isTeacher = this.auth.hasRole('TEACHER');
  }

  ngOnInit(): void {
    this.loadYears();
    this.loadAttempts();
  }

  loadYears(): void {
    this.api.getYears().subscribe({
      next: (years) => (this.years = years),
    });
  }

  loadAttempts(): void {
    this.loading = true;
    let obs;
    if (this.selectedPaperId) {
      obs = this.isTeacher
        ? this.api.getTeacherStudentAttemptsByPaper(
            this.selectedPaperId,
            this.currentPage,
            this.pageSize,
          )
        : this.api.getStudentAttemptsByPaper(
            this.selectedPaperId,
            this.currentPage,
            this.pageSize,
          );
    } else {
      const paperType = this.selectedPaperType ?? undefined;
      obs = this.isTeacher
        ? this.api.getTeacherStudentAttempts(
            this.currentPage,
            this.pageSize,
            paperType,
          )
        : this.api.getStudentAttempts(
            this.currentPage,
            this.pageSize,
            paperType,
          );
    }

    obs.subscribe({
      next: (res) => {
        this.attempts = res.content;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('පිළිතුරු ලබාගැනීම අසාර්ථකයි.');
      },
    });
  }

  onYearChange(): void {
    this.selectedPaperId = null;
    if (this.selectedYear) {
      this.api.getPapersByYear(this.selectedYear).subscribe({
        next: (papers) => (this.papers = papers),
      });
    } else {
      this.papers = [];
    }
    this.currentPage = 0;
    this.loadAttempts();
  }

  onPaperChange(): void {
    this.currentPage = 0;
    this.loadAttempts();
  }

  onPaperTypeChange(): void {
    this.selectedYear = null;
    this.selectedPaperId = null;
    this.papers = [];
    this.currentPage = 0;
    this.loadAttempts();
  }

  clearFilters(): void {
    this.selectedYear = null;
    this.selectedPaperId = null;
    this.selectedPaperType = null;
    this.papers = [];
    this.currentPage = 0;
    this.loadAttempts();
  }

  viewDetail(attemptId: string): void {
    this.loading = true;
    const obs = this.isTeacher
      ? this.api.getTeacherAttemptDetail(attemptId)
      : this.api.getAttemptDetail(attemptId);
    obs.subscribe({
      next: (detail) => {
        this.selectedAttempt = detail;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('විස්තර ලබාගැනීම අසාර්ථකයි.');
      },
    });
  }

  closeDetail(): void {
    this.selectedAttempt = null;
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadAttempts();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getOptionLetter(order: number): string {
    return String.fromCharCode(64 + order); // 1=A, 2=B, 3=C, 4=D
  }
}
