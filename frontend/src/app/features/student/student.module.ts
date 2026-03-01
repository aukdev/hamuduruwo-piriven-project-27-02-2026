import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { YearsComponent } from './years/years.component';
import { PapersComponent } from './papers/papers.component';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'years', component: YearsComponent },
  { path: 'years/:year/papers', component: PapersComponent },
  { path: 'exam/:attemptId', component: ExamComponent },
  { path: 'result/:attemptId', component: ResultComponent },
];

@NgModule({
  declarations: [
    StudentDashboardComponent,
    YearsComponent,
    PapersComponent,
    ExamComponent,
    ResultComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class StudentModule {}
