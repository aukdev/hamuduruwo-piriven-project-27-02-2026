import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../shared-imports';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaperDto } from '../../../core/models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-practice-paper-approvals',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './practice-paper-approvals.component.html',
  styleUrls: ['./practice-paper-approvals.component.scss'],
})
export class PracticePaperApprovalsComponent implements OnInit {
  papers: PaperDto[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  selectedTab = 0;
  statusFilter: string | undefined = 'PENDING_APPROVAL';

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private notify: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadPapers();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.currentPage = 0;
    switch (index) {
      case 0:
        this.statusFilter = 'PENDING_APPROVAL';
        break;
      case 1:
        this.statusFilter = 'APPROVED';
        break;
      case 2:
        this.statusFilter = undefined;
        break;
    }
    this.loadPapers();
  }

  loadPapers(): void {
    this.loading = true;
    this.api
      .getAllPracticePapers(this.statusFilter, this.currentPage, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.papers = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadPapers();
  }

  approve(paper: PaperDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පුහුණු පත්‍රය අනුමත කරන්න',
        message: `"${paper.title}" අනුමත කිරීමට අවශ්‍යද?\n\nවිෂය: ${paper.subjectName}\nසාදන ලද්දේ: ${paper.createdByName || paper.createdByEmail}\nප්‍රශ්න: ${paper.assignedQuestions}/${paper.questionCount}`,
        confirmText: 'අනුමත කරන්න',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.approvePracticePaper(paper.id).subscribe({
          next: () => {
            this.notify.success('පුහුණු පත්‍රය සාර්ථකව අනුමත කරන ලදී!');
            this.loadPapers();
          },
          error: (err: any) =>
            this.notify.error(err.error?.message || 'අනුමත කිරීම අසාර්ථකයි.'),
        });
      }
    });
  }

  reject(paper: PaperDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'පුහුණු පත්‍රය ප්‍රතික්ෂේප කරන්න',
        message: 'ප්‍රතික්ෂේප කිරීමේ හේතුව ඇතුළත් කරන්න:',
        confirmText: 'ප්‍රතික්ෂේප කරන්න',
        dangerous: true,
        showInput: true,
        inputLabel: 'හේතුව',
      },
      width: '440px',
    });

    ref.afterClosed().subscribe((result) => {
      if (result && result.inputValue) {
        this.api
          .rejectPracticePaper(paper.id, { reason: result.inputValue })
          .subscribe({
            next: () => {
              this.notify.success('පුහුණු පත්‍රය ප්‍රතික්ෂේප කරන ලදී.');
              this.loadPapers();
            },
            error: (err: any) =>
              this.notify.error(
                err.error?.message || 'ප්‍රතික්ෂේප කිරීම අසාර්ථකයි.',
              ),
          });
      }
    });
  }
}
