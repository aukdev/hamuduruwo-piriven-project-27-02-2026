import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { PaperManagementComponent } from './paper-management/paper-management.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';
import { PracticePaperApprovalsComponent } from '../../shared/components/practice-paper-approvals/practice-paper-approvals.component';
import { PracticePaperReviewComponent } from '../../shared/components/practice-paper-review/practice-paper-review.component';
import { VcharaSubjectManagementComponent } from './vichara-subject-management/vichara-subject-management.component';
import { VcharaManagementComponent } from './vichara-management/vichara-management.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'approvals', component: PendingApprovalsComponent },
  {
    path: 'practice-paper-management',
    component: PracticePaperApprovalsComponent,
  },
  {
    path: 'practice-paper-management/:paperId',
    component: PracticePaperReviewComponent,
  },
  { path: 'users', component: UserManagementComponent },
  { path: 'subjects', component: SubjectManagementComponent },
  { path: 'papers', component: PaperManagementComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
  { path: 'vichara-subjects', component: VcharaSubjectManagementComponent },
  { path: 'vichara', component: VcharaManagementComponent },
];
