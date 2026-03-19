import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { PaperManagementComponent } from './paper-management/paper-management.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'approvals', component: PendingApprovalsComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'subjects', component: SubjectManagementComponent },
  { path: 'papers', component: PaperManagementComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
];
