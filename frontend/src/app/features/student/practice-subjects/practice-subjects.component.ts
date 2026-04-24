import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-practice-subjects',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './practice-subjects.component.html',
  styleUrls: ['./practice-subjects.component.scss'],
})
export class PracticeSubjectsComponent implements OnInit {
  subjects: SubjectDto[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getPracticeSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects.sort((a, b) => a.name.localeCompare(b.name));
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  selectSubject(subject: SubjectDto): void {
    this.router.navigate(['/student/practice', subject.id, 'papers']);
  }
}
