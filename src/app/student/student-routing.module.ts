import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageExamsComponent } from './components/manage-exams/manage-exams.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { DeekchatComponent } from './components/deekchat/deekchat.component';
import { PerformanceComponent } from './components/performances/performances.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent, 
      },
      {
        path: 'manage-exams',
        component: ManageExamsComponent,
      },
      {
        path: 'claims',
        component: ClaimsComponent,
      },
      {
        path: 'deekchat',
        component: DeekchatComponent,
      },
      {
        path: 'performances',
        component: PerformanceComponent,
      },
      {
        path: 'submissions',
        component: SubmissionsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }