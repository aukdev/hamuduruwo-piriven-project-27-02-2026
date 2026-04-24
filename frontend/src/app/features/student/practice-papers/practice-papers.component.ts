import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-practice-papers',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './practice-papers.component.html',
  styleUrls: ['./practice-papers.component.scss'],
})
export class PracticePapersComponent implements OnInit {
  subjectId = '';
  papers: PaperDto[] = [];
  loading = true;
  subjectName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.params['subjectId'];
    this.api.getPracticePapersBySubject(this.subjectId).subscribe({
      next: (papers) => {
        this.papers = papers;
        if (papers.length > 0) {
          this.subjectName = papers[0].subjectName;
        }
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  confirmStart(paper: PaperDto): void {
    if (paper.assignedQuestions < paper.questionCount) {
      this.notify.error('මෙම ප්‍රශ්න පත්‍රය තවම සූදානම් නැත.');
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පුහුණු විභාගය ආරම්භ කරන්න',
        message: `${paper.title || paper.subjectName} ආරම්භ කිරීමට අවශ්‍යද?\n\n⏱ මුළු කාලය: මිනිත්තු ${paper.durationSeconds / 60}\n📝 ප්‍රශ්න: ${paper.questionCount}`,
        confirmText: 'ආරම්භ කරන්න',
        cancelText: 'නැත',
      },
      width: '400px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.startExam(paper.id);
      }
    });
  }

  private startExam(paperId: string): void {
    this.api.startAttempt(paperId).subscribe({
      next: (res) => {
        this.router.navigate(['/student/exam', res.attemptId]);
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'විභාගය ආරම්භ කළ නොහැක.');
      },
    });
  }
}
