import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ApiService } from '../../../core/services/api.service';
import {
  VcharaSubjectDto,
  VcharaDto,
  PagedResponse,
} from '../../../core/models';

@Component({
  selector: 'app-vichara',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './vichara.component.html',
  styleUrls: ['./vichara.component.scss'],
})
export class VcharaComponent implements OnInit {
  subjects: VcharaSubjectDto[] = [];
  vicharas: VcharaDto[] = [];
  selectedSubjectId = '';
  loading = true;
  loadingVicharas = false;

  // pagination
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  // expanded vichara
  expandedId: string | null = null;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.api.getVcharaSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        if (subjects.length > 0) {
          this.selectSubject(subjects[0].id);
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  selectSubject(subjectId: string): void {
    this.selectedSubjectId = subjectId;
    this.page = 0;
    this.expandedId = null;
    this.loadVicharas();
  }

  loadVicharas(): void {
    this.loadingVicharas = true;
    this.api
      .getVicharas(this.selectedSubjectId, this.page, this.size)
      .subscribe({
        next: (res: PagedResponse<VcharaDto>) => {
          this.vicharas = res.content;
          this.totalElements = res.totalElements;
          this.totalPages = res.totalPages;
          this.loading = false;
          this.loadingVicharas = false;
        },
        error: () => {
          this.loading = false;
          this.loadingVicharas = false;
        },
      });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.expandedId = null;
    this.loadVicharas();
  }

  toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
