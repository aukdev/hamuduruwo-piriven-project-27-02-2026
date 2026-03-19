import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
  @Input() type:
    | 'card-list'
    | 'card-grid'
    | 'stats'
    | 'table'
    | 'user-list'
    | 'question-list'
    | 'dashboard'
    | 'result' = 'card-list';
  @Input() count = 3;
  @Input() gridMinWidth = '280px';

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
