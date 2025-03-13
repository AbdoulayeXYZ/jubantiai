import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { StudentComponent } from './student.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    StudentComponent,
    StudentHeaderComponent,
    StudentSidebarComponent,
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    RouterModule,
  ]
})
export class StudentModule { }
