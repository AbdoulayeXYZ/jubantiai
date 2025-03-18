import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { ManageStudentsComponent } from './components/manage-students/manage-students.component';
import { ClassroomsComponent } from './components/classrooms/classrooms.component';
import { CorrectionsComponent } from './components/corrections/corrections.component';
import { ExamsComponent } from './components/exams/exams.component';
import { StudentstatsComponent } from './components/studentstats/studentstats.component';

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
        path: 'statistics',
        component: StudentstatsComponent ,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
