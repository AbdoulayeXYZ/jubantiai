import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { StudentComponent } from './student.component';
import { RouterModule } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ManageExamsComponent } from './components/manage-exams/manage-exams.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { PerformancesComponent } from './components/performances/performances.component';
import { DeepchatComponent } from './components/deepchat/deepchat.component';


@NgModule({
  declarations: [
    StudentComponent,
    StudentHeaderComponent,
    StudentSidebarComponent,
    ManageExamsComponent,
    SubmissionsComponent,
    ClaimsComponent,
    DeepchatComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    RouterModule,
    FormsModule,
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class StudentModule { }
