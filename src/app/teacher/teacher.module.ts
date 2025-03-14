import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Ajouter RouterModule
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { TeacherHeaderComponent } from './teacher-header/teacher-header.component';
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';
import { ExamsComponent } from './components/exams/exams.component';
import { CorrectionsComponent } from './components/corrections/corrections.component';
import { PerformnancesComponent } from './components/performnances/performnances.component';

@NgModule({
  declarations: [
    TeacherComponent,
    TeacherHeaderComponent,
    TeacherSidebarComponent,
    ExamsComponent,
    CorrectionsComponent,
    PerformnancesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TeacherRoutingModule,
  ]
})
export class TeacherModule { }