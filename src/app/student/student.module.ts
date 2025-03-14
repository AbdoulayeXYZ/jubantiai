import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ajoutez cette ligne si elle n'existe pas déjà
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component'; 
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
// Autres imports...

@NgModule({
  declarations: [
    StudentComponent,
    StudentHeaderComponent,
    StudentSidebarComponent 
  ],
  imports: [
    CommonModule,
    RouterModule, // Ajoutez cette ligne
    StudentRoutingModule,
    // Autres modules...
  ]
})
export class StudentModule { }