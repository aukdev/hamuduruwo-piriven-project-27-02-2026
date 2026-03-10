import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component';
import { QuestionCreateComponent } from './question-create/question-create.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { TeacherPapersComponent } from './teacher-papers/teacher-papers.component';
import { StudentAnswersComponent } from '../../shared/components/student-answers/student-answers.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: TeacherDashboardComponent },
  { path: 'papers', component: TeacherPapersComponent },
  { path: 'questions/create', component: QuestionCreateComponent },
  { path: 'questions/edit/:id', component: QuestionCreateComponent },
  { path: 'questions/:id', component: QuestionDetailComponent },
  { path: 'questions', component: QuestionListComponent },
  { path: 'student-answers', component: StudentAnswersComponent },
];

@NgModule({
  declarations: [
    TeacherDashboardComponent,
    QuestionCreateComponent,
    QuestionListComponent,
    QuestionDetailComponent,
    TeacherPapersComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class TeacherModule {}
