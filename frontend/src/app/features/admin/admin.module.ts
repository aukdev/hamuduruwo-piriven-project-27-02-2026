import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { PaperManagementComponent } from './paper-management/paper-management.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'approvals', component: PendingApprovalsComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'subjects', component: SubjectManagementComponent },
  { path: 'papers', component: PaperManagementComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    PendingApprovalsComponent,
    UserManagementComponent,
    SubjectManagementComponent,
    PaperManagementComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
