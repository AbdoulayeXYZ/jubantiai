import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamSubjectsComponent } from './exam-subjects/exam-subjects.component';
import { SubmissionComponent } from './submission/submission.component';
import { GradesComponent } from './grades/grades.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  { path: 'exam-subjects', component: ExamSubjectsComponent },
  { path: 'submission', component: SubmissionComponent },
  { path: 'grades', component: GradesComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: '', redirectTo: 'exam-subjects', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
