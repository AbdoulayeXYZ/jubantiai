import { Component, OnInit } from '@angular/core';

// Définir les interfaces
interface Classroom {
  id: number;
  name: string;
  exams: Exam[];
}

interface Exam {
  id: number;
  title: string;
  status: 'pending' | 'corrected';
}

interface Correction {
  examId: number;
  status: 'loading' | 'completed';
}

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.css'],
  standalone:false
})
export class CorrectionsComponent implements OnInit {
  // Données de démonstration
  classrooms: Classroom[] = [
    {
      id: 1,
      name: 'DIC1',
      exams: [
        { id: 101, title: 'Math Exam', status: 'pending' },
        { id: 102, title: 'Science Exam', status: 'pending' },
      ],
    },
    {
      id: 2,
      name: 'DIC2',
      exams: [
        { id: 201, title: 'History Exam', status: 'pending' },
        { id: 202, title: 'Geography Exam', status: 'pending' },
      ],
    },
  ];

  // Variables d'état
  selectedClassroom: Classroom | null = null;
  selectedExam: Exam | null = null;
  correctionStatus: Correction | null = null;

  constructor() {}

  ngOnInit(): void {}

  // Sélectionner une classe
  selectClassroom(classroom: Classroom): void {
    console.log('Classe sélectionnée:', classroom); // Vérifiez la sélection
    this.selectedClassroom = classroom;
    this.selectedExam = null; // Réinitialiser l'examen sélectionné
  }

  // Sélectionner un examen
  selectExam(exam: Exam): void {
    console.log('Examen sélectionné:', exam); // Vérifiez la sélection
    this.selectedExam = exam;
  }

  // Générer la correction
  generateCorrection(): void {
    if (!this.selectedExam) return;

    // Simuler le chargement de la correction
    this.correctionStatus = { examId: this.selectedExam.id, status: 'loading' };

    setTimeout(() => {
      this.correctionStatus = { examId: this.selectedExam!.id, status: 'completed' };
      this.sendNotification(); // Envoyer une notification
    }, 3000); // Simuler un délai de 3 secondes
  }

  // Envoyer une notification
  sendNotification(): void {
    alert('La correction est terminée ! Une notification a été envoyée au professeur.');
  }
}