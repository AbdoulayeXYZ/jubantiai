import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ajouter RouterModule
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { TeacherHeaderComponent } from './teacher-header/teacher-header.component';
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';

@NgModule({
  declarations: [
    TeacherComponent,
    TeacherHeaderComponent,
    TeacherSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TeacherRoutingModule,
  ]
})
export class TeacherModule { }