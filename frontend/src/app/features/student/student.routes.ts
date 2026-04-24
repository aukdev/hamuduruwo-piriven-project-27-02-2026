import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { YearsComponent } from './years/years.component';
import { PapersComponent } from './papers/papers.component';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';
import { PracticeSubjectsComponent } from './practice-subjects/practice-subjects.component';
import { PracticePapersComponent } from './practice-papers/practice-papers.component';

export const STUDENT_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: StudentDashboardComponent },
  { path: 'years', component: YearsComponent },
  { path: 'years/:year/papers', component: PapersComponent },
  { path: 'practice', component: PracticeSubjectsComponent },
  { path: 'practice/:subjectId/papers', component: PracticePapersComponent },
  { path: 'exam/:attemptId', component: ExamComponent },
  { path: 'result/:attemptId', component: ResultComponent },
];
