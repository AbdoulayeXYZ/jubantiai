import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { ManageStudentsComponent } from './components/manage-students/manage-students.component';
import { ClassroomsComponent } from './components/classrooms/classrooms.component';
import { Exam } from '../../../backend/src/entities/exam.entity';
import { CorrectionsComponent } from './components/corrections/corrections.component';
import { PerformancesComponent } from '../student/components/performances/performances.component';
import { ExamsComponent } from './components/exams/exams.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: TeacherDashboardComponent, 
      },
      {
        path: 'manage-students',
        component: ManageStudentsComponent,
      },
      {
        path: 'classrooms',
        component: ClassroomsComponent ,
      },
      {
        path: 'exams',
        component: ExamsComponent,
      },
      {
        path: 'corrections',
        component: CorrectionsComponent ,
      },
      {
        path: 'performances',
        component: PerformancesComponent ,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
