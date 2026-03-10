import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { QuestionDto, PaperDto, SubjectDto } from '../../../core/models';

@Component({
  selector: 'app-question-detail',
  template: `
    <app-loading-overlay [show]="loading"></app-loading-overlay>

    <div *ngIf="question && !loading">
      <app-page-header
        [title]="'ප්‍රශ්න විස්තර'"
        [subtitle]="'#' + question.id"
      >
        <button mat-stroked-button routerLink="/teacher/questions">
          <mat-icon>arrow_back</mat-icon> ආපසු
        </button>
        <button
          mat-flat-button
          color="primary"
          *ngIf="question.status === 'DRAFT' || question.status === 'REJECTED'"
          [routerLink]="['/teacher/questions/edit', question.id]"
        >
          <mat-icon>edit</mat-icon> සංස්කරණය
        </button>
      </app-page-header>

      <mat-card class="detail-card">
        <div class="detail-meta">
          <span class="status-badge status-{{ question.status }}">{{
            getStatusLabel(question.status)
          }}</span>
          <span class="meta-chip">{{ question.subjectName }}</span>
          <span class="meta-chip meta-chip--year">{{ question.year }}</span>
          <span class="meta-chip">{{
            question.createdAt | date: 'yyyy-MM-dd HH:mm'
          }}</span>
        </div>

        <!-- Paper Assignment -->
        <div class="paper-info" *ngIf="question.paperId">
          <mat-icon>description</mat-icon>
          <span>ප්‍රශ්න පත්‍රයට පවරා ඇත</span>
        </div>
        <div
          class="paper-assign"
          *ngIf="
            !question.paperId &&
            (question.status === 'DRAFT' || question.status === 'REJECTED')
          "
        >
          <mat-icon color="warn">warning</mat-icon>
          <span>ප්‍රශ්න පත්‍රයකට පවරා නැත</span>
          <button
            mat-stroked-button
            color="primary"
            (click)="showAssignPanel = !showAssignPanel"
          >
            <mat-icon>link</mat-icon> පත්‍රයකට පවරන්න
          </button>
        </div>

        <!-- Paper Assign Panel -->
        <div class="assign-panel" *ngIf="showAssignPanel">
          <mat-form-field appearance="outline">
            <mat-label>විෂය තෝරන්න</mat-label>
            <mat-select
              [(value)]="selectedSubjectId"
              (selectionChange)="onAssignSubjectChange($event.value)"
            >
              <mat-option *ngFor="let s of subjects" [value]="s.id">{{
                s.name
              }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>ප්‍රශ්න පත්‍රය</mat-label>
            <mat-select [(value)]="selectedPaperId">
              <mat-option *ngFor="let p of papers" [value]="p.id">
                {{ p.year }} - {{ p.subjectName }} ({{ p.assignedQuestions }}/{{
                  p.questionCount
                }})
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button
            mat-flat-button
            color="primary"
            [disabled]="!selectedPaperId || assigning"
            (click)="assignToPaper()"
          >
            <mat-icon>check</mat-icon> පවරන්න
          </button>
        </div>

        <h3 class="question-text">{{ question.questionText }}</h3>

        <div class="options-grid">
          <div
            class="option-item"
            *ngFor="let opt of question.options; let i = index"
            [class.correct]="opt.isCorrect"
          >
            <span class="option-letter">{{ getLetters()[i] }}</span>
            <span class="option-text">{{ opt.optionText }}</span>
            <mat-icon class="correct-icon" *ngIf="opt.isCorrect"
              >check_circle</mat-icon
            >
          </div>
        </div>

        <!-- Rejection Reason -->
        <div
          class="rejection-box"
          *ngIf="question.status === 'REJECTED' && question.rejectionReason"
        >
          <mat-icon>warning</mat-icon>
          <div>
            <strong>ප්‍රතික්ෂේප හේතුව</strong>
            <p>{{ question.rejectionReason }}</p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .detail-card {
        padding: 28px !important;
      }
      .detail-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        margin-bottom: 20px;
      }
      .meta-chip {
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        background: #f0f0f5;
        border-radius: 6px;
        color: #555;
      }
      .meta-chip--year {
        background: rgba(46, 125, 50, 0.08);
        color: #2e7d32;
      }
      .question-text {
        font-size: 17px;
        line-height: 1.8;
        color: #1a1a2e;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
      }
      .options-grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        background: #fafafa;
        transition: all 0.15s;

        &.correct {
          border-color: #2e7d32;
          background: rgba(46, 125, 50, 0.04);
        }
      }
      .option-letter {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 700;
        font-size: 14px;
        background: #e8eaf6;
        color: #0b3d91;

        .correct & {
          background: #e8f5e9;
          color: #2e7d32;
        }
      }
      .option-text {
        flex: 1;
        font-size: 14px;
        color: #333;
      }
      .correct-icon {
        color: #2e7d32;
      }
      .rejection-box {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding: 16px;
        background: rgba(198, 40, 40, 0.05);
        border-radius: 10px;
        border-left: 4px solid #c62828;

        mat-icon {
          color: #c62828;
          margin-top: 2px;
        }
        strong {
          display: block;
          color: #c62828;
          margin-bottom: 4px;
          font-size: 14px;
        }
        p {
          margin: 0;
          color: #555;
          font-size: 13px;
          line-height: 1.6;
        }
      }
      .paper-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding: 10px 14px;
        background: rgba(46, 125, 50, 0.06);
        border-radius: 8px;
        border-left: 3px solid #2e7d32;
        font-size: 13px;
        color: #2e7d32;
        font-weight: 600;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
      .paper-assign {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
        padding: 10px 14px;
        background: rgba(255, 152, 0, 0.06);
        border-radius: 8px;
        border-left: 3px solid #ff9800;
        font-size: 13px;
        color: #e65100;
        font-weight: 600;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
        button {
          margin-left: auto;
        }
      }
      .assign-panel {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 16px;
        padding: 16px;
        background: #f8f9fb;
        border-radius: 10px;
        border: 1px solid #e0e3eb;

        mat-form-field {
          flex: 1;
          min-width: 200px;
        }
      }
    `,
  ],
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
