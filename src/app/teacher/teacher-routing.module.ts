import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component'; // Import TeacherDashboardComponent


const routes: Routes = [
  {
    path: '',
    component: TeacherDashboardComponent // Add route for TeacherDashboardComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
