import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateExamComponent } from './pages/create-exam/create-exam.component';
import { ExamListComponent } from './pages/exam-list/exam-list.component';
import { ExamDetailsComponent } from './pages/exam-details/exam-details.component';
import { StudentSubmissionsComponent } from './pages/student-submissions/student-submissions.component';
import { ExamCorrectionComponent } from './pages/exam-correction/exam-correction.component';
import { ExamStatisticsComponent } from './pages/exam-statistics/exam-statistics.component';



@NgModule({
  declarations: [
    DashboardComponent,
    CreateExamComponent,
    ExamListComponent,
    ExamDetailsComponent,
    StudentSubmissionsComponent,
    ExamCorrectionComponent,
    ExamStatisticsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TeacherModule { }
