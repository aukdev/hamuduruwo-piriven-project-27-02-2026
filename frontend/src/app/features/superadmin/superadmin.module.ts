import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SuperadminDashboardComponent } from './dashboard/superadmin-dashboard.component';
import { SuperadminApprovalsComponent } from './approvals/superadmin-approvals.component';
import { SuperadminUsersComponent } from './users/superadmin-users.component';
import { SuperadminPapersComponent } from './papers/superadmin-papers.component';
import { SuperadminSubjectsComponent } from './subjects/superadmin-subjects.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: SuperadminDashboardComponent },
  { path: 'approvals', component: SuperadminApprovalsComponent },
  { path: 'users', component: SuperadminUsersComponent },
  { path: 'papers', component: SuperadminPapersComponent },
  { path: 'subjects', component: SuperadminSubjectsComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
];

@NgModule({
  declarations: [
    SuperadminDashboardComponent,
    SuperadminApprovalsComponent,
    SuperadminUsersComponent,
    SuperadminPapersComponent,
    SuperadminSubjectsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SuperadminModule {}
