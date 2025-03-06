import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExamListsComponent } from './pages/exam-lists/exam-lists.component';
import { ExamDetailsComponent } from './pages/exam-details/exam-details.component';
import { ExamSubmissionComponent } from './pages/exam-submission/exam-submission.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ExamListsComponent,
    ExamDetailsComponent,
    ExamSubmissionComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StudentModule { }
