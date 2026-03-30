import { Routes } from '@angular/router';
import { SuperadminDashboardComponent } from './dashboard/superadmin-dashboard.component';
import { SuperadminApprovalsComponent } from './approvals/superadmin-approvals.component';
import { SuperadminUsersComponent } from './users/superadmin-users.component';
import { SuperadminPapersComponent } from './papers/superadmin-papers.component';
import { SuperadminSubjectsComponent } from './subjects/superadmin-subjects.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';
import { PracticePaperApprovalsComponent } from '../../shared/components/practice-paper-approvals/practice-paper-approvals.component';
import { PracticePaperReviewComponent } from '../../shared/components/practice-paper-review/practice-paper-review.component';
import { VcharaSubjectManagementComponent } from '../admin/vichara-subject-management/vichara-subject-management.component';
import { VcharaManagementComponent } from '../admin/vichara-management/vichara-management.component';

export const SUPERADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: SuperadminDashboardComponent },
  { path: 'approvals', component: SuperadminApprovalsComponent },
  {
    path: 'practice-paper-management',
    component: PracticePaperApprovalsComponent,
  },
  {
    path: 'practice-paper-management/:paperId',
    component: PracticePaperReviewComponent,
  },
  { path: 'users', component: SuperadminUsersComponent },
  { path: 'papers', component: SuperadminPapersComponent },
  { path: 'subjects', component: SuperadminSubjectsComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
  { path: 'vichara-subjects', component: VcharaSubjectManagementComponent },
  { path: 'vichara', component: VcharaManagementComponent },
];
