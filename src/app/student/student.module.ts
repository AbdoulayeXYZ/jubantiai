import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { SubmissionComponent } from './submission/submission.component'; // Ajout de l'importation
import { ExamSubjectsComponent } from './exam-subjects/exam-subjects.component'; // Ajout de l'importation
import { GradesComponent } from './grades/grades.component'; // Ajout de l'importation
import { ChatbotComponent } from './chatbot/chatbot.component'; // Ajout de l'importation
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import des modules de formulaire

@NgModule({
  declarations: [
    // Remove all standalone components from here
  ],





  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule // Ajout des modules de formulaire
    // Do not import standalone components here
  ]





})
export class StudentModule { }
