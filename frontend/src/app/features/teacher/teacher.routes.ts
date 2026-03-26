import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';
import { QuestionCreateComponent } from './question-create/question-create.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { TeacherPapersComponent } from './teacher-papers/teacher-papers.component';
import { TeacherPracticePapersComponent } from './teacher-practice-papers/teacher-practice-papers.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';

export const TEACHER_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: TeacherDashboardComponent },
  { path: 'papers', component: TeacherPapersComponent },
  { path: 'practice-papers', component: TeacherPracticePapersComponent },
  { path: 'questions/create', component: QuestionCreateComponent },
  { path: 'questions/edit/:id', component: QuestionCreateComponent },
  { path: 'questions/:id', component: QuestionDetailComponent },
  { path: 'questions', component: QuestionListComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
];
