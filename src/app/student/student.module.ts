import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { StudentComponent } from './student.component';
import { RouterModule } from '@angular/router';
import { ManageExamsComponent } from './components/manage-exams/manage-exams.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { PerformanceComponent } from './components/performances/performances.component';
import { DeekchatComponent } from './components/deekchat/deekchat.component';


@NgModule({
  declarations: [
    StudentComponent,
    StudentHeaderComponent,
    StudentSidebarComponent,
    ManageExamsComponent,
    SubmissionsComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    RouterModule,
    ClaimsComponent,
    DeekchatComponent,
  ]
})
export class StudentModule { }
