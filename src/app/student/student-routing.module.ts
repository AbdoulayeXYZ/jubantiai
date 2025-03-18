import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerformancesComponent } from './components/performances/performances.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { DeepchatComponent } from './components/deepchat/deepchat.component';
import { ManageExamsComponent } from './components/manage-exams/manage-exams.component';

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
        path: 'performances',
        component: PerformancesComponent,
      },
      {
        path: 'submission',
        component: SubmissionsComponent,
      },
      {
        path: 'claims',
        component: ClaimsComponent,
      },
      {
        path: 'deepchat',
        component: DeepchatComponent,
      },
      {
        path: 'manage-students',
        component: ManageExamsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
