import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SuperadminDashboardComponent } from './dashboard/superadmin-dashboard.component';
import { SuperadminQuestionsComponent } from './questions/superadmin-questions.component';
import { SuperadminUsersComponent } from './users/superadmin-users.component';
import { SuperadminPapersComponent } from './papers/superadmin-papers.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: SuperadminDashboardComponent },
  { path: 'questions', component: SuperadminQuestionsComponent },
  { path: 'users', component: SuperadminUsersComponent },
  { path: 'papers', component: SuperadminPapersComponent },
];

@NgModule({
  declarations: [
    SuperadminDashboardComponent,
    SuperadminQuestionsComponent,
    SuperadminUsersComponent,
    SuperadminPapersComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SuperadminModule {}
