import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ApiService } from '../../../core/services/api.service';
import { QuestionDto, PaperDto, SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
})
export class QuestionDetailComponent implements OnInit {
  question: QuestionDto | null = null;
  loading = true;
  showAssignPanel = false;
  subjects: SubjectDto[] = [];
  papers: PaperDto[] = [];
  selectedSubjectId = '';
  selectedPaperId = '';
  assigning = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/teacher/questions']);
      return;
    }
    this.api.getQuestion(id).subscribe({
      next: (q) => {
        this.question = q;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/teacher/questions']);
      },
    });
    this.api.getMySubjects().subscribe((s) => (this.subjects = s));
  }

  onAssignSubjectChange(subjectId: string): void {
    this.selectedPaperId = '';
    this.papers = [];
    if (!subjectId) return;
    this.api
      .getTeacherPapersBySubject(subjectId)
      .subscribe((papers) => (this.papers = papers));
  }

  assignToPaper(): void {
    if (!this.question || !this.selectedPaperId) return;
    this.assigning = true;
    this.api
      .assignPaperToQuestion(this.question.id, this.selectedPaperId)
      .subscribe({
        next: (q) => {
          this.question = q;
          this.showAssignPanel = false;
          this.assigning = false;
        },
        error: () => (this.assigning = false),
      });
  }

  getLetters(): string[] {
    return ['A', 'B', 'C', 'D'];
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      DRAFT: 'කෙටුම්පත',
      PENDING_REVIEW: 'සමාලෝචනයට',
      APPROVED: 'අනුමත',
      REJECTED: 'ප්‍රතික්ෂේප',
    };
    return map[status] || status;
  }
}
