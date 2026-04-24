import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [...SHARED_IMPORTS, PageHeaderComponent],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.scss'],
})
export class SuperadminDashboardComponent {}
