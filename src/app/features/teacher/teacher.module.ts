import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateExamComponent } from './pages/create-exam/create-exam.component';
import { ExamListComponent } from './pages/exam-list/exam-list.component';
import { ExamDetailsComponent } from './pages/exam-details/exam-details.component';
import { StudentSubmissionsComponent } from './pages/student-submissions/student-submissions.component';
import { ExamCorrectionComponent } from './pages/exam-correction/exam-correction.component';
import { ExamStatisticsComponent } from './pages/exam-statistics/exam-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'exams',
        children: [
          {
            path: '',
            component: ExamListComponent
          },
          {
            path: 'create',
            component: CreateExamComponent
          },
          {
            path: ':id',
            component: ExamDetailsComponent
          },
          {
            path: ':id/submissions',
            component: StudentSubmissionsComponent
          },
          {
            path: ':id/correction',
            component: ExamCorrectionComponent
          },
          {
            path: ':id/statistics',
            component: ExamStatisticsComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TeacherDashboardComponent,
    DashboardComponent,
    CreateExamComponent,
    ExamListComponent,
    ExamDetailsComponent,
    StudentSubmissionsComponent,
    ExamCorrectionComponent,
    ExamStatisticsComponent
  ]
})
export class TeacherModule { }
