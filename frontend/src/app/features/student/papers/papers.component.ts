import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-papers',
  template: `
    <app-page-header
      [title]="year + ' වර්ෂයේ ප්‍රශ්න පත්‍ර'"
      subtitle="ප්‍රශ්න පත්‍රයක් තෝරා විභාගය අරඹන්න"
    >
      <button mat-stroked-button routerLink="/student/years">
        <mat-icon>arrow_back</mat-icon> ආපසු
      </button>
    </app-page-header>

    <app-skeleton *ngIf="loading" type="card-grid" [count]="6"></app-skeleton>

    <div class="papers-grid" *ngIf="!loading">
      <mat-card
        class="paper-card"
        *ngFor="let paper of papers"
        (click)="confirmStart(paper)"
      >
        <div class="paper-card__header">
          <div class="paper-card__no">
            {{ paper.subjectName?.charAt(0) }}
          </div>
          <mat-chip-listbox>
            <mat-chip
              [class.ready]="paper.assignedQuestions >= paper.questionCount"
              highlighted
            >
              {{
                paper.assignedQuestions >= paper.questionCount
                  ? 'සූදානම්'
                  : 'ප්‍රශ්න අඩුයි'
              }}
            </mat-chip>
          </mat-chip-listbox>
        </div>
        <h3 class="paper-card__title">{{ paper.subjectName }}</h3>
        <div class="paper-card__meta">
          <span
            ><mat-icon>quiz</mat-icon> ප්‍රශ්න {{ paper.questionCount }}</span
          >
          <span
            ><mat-icon>timer</mat-icon> මිනිත්තු
            {{ paper.durationSeconds / 60 }}</span
          >
        </div>
        <div class="paper-card__assigned">
          <span
            >ප්‍රශ්න සංඛ්‍යාව: {{ paper.assignedQuestions }}/{{
              paper.questionCount
            }}</span
          >
          <mat-progress-bar
            mode="determinate"
            [value]="(paper.assignedQuestions / paper.questionCount) * 100"
          >
          </mat-progress-bar>
        </div>
      </mat-card>
    </div>

    <app-empty-state
      *ngIf="!loading && papers.length === 0"
      icon="description"
      title="ප්‍රශ්න පත්‍ර නොමැත"
      message="මෙම වර්ෂයට ප්‍රශ්න පත්‍ර තවම එකතු කර නැත."
    >
    </app-empty-state>
  `,
  styles: [
    `
      .papers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }
      .paper-card {
        padding: 24px !important;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          transform: translateY(-3px);
        }
      }
      .paper-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .paper-card__no {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(
          135deg,
          var(--color-primary),
          var(--color-primary-light)
        );
        color: var(--color-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 18px;
      }
      .ready {
        background: var(--color-success) !important;
        color: #fff !important;
      }
      .paper-card__title {
        font-size: 16px;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: 12px;
      }
      .paper-card__meta {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--color-text-secondary);

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }
      .paper-card__assigned {
        span {
          font-size: 12px;
          color: var(--color-text-secondary);
          display: block;
          margin-bottom: 6px;
        }
      }
    `,
  ],
})
export class PapersComponent implements OnInit {
  year = 0;
  papers: PaperDto[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.year = +this.route.snapshot.params['year'];
    this.api.getPapersByYear(this.year).subscribe({
      next: (papers) => {
        this.papers = papers.sort((a, b) =>
          a.subjectName.localeCompare(b.subjectName),
        );
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
        title: 'විභාගය ආරම්භ කරන්න',
        message: `${this.year} වර්ෂයේ ${paper.subjectName} ආරම්භ කිරීමට අවශ්‍යද?\n\n⏱ මුළු කාලය: මිනිත්තු ${paper.durationSeconds / 60}\n📝 ප්‍රශ්න: ${paper.questionCount}\n⏳ එක් ප්‍රශ්නයකට: තත්පර 30`,
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
