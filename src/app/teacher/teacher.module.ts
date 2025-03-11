import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionService } from './submission.service'; // Import SubmissionService
import { ExamService } from './exam.service'; // Import ExamService

import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component'; // Import TeacherDashboardComponent (standalone)

import { TeacherRoutingModule } from './teacher-routing.module';

@NgModule({
  providers: [SubmissionService, ExamService], // Add SubmissionService and ExamService to providers
  imports: [
    CommonModule,
    TeacherRoutingModule,
    TeacherDashboardComponent // Import the standalone component here
  ]
})
export class TeacherModule { }
