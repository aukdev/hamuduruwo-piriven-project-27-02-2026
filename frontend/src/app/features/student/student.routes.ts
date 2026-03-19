import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { YearsComponent } from './years/years.component';
import { PapersComponent } from './papers/papers.component';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';

export const STUDENT_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'years', component: YearsComponent },
  { path: 'years/:year/papers', component: PapersComponent },
  { path: 'exam/:attemptId', component: ExamComponent },
  { path: 'result/:attemptId', component: ResultComponent },
];
