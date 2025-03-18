import { Component } from '@angular/core';

interface Exam {
  title: string;
  code: string;
  deadline: string;
  description: string;
}

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  standalone: false,
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent {
  exams: Exam[] = [
    {
      title: 'Examen Final - Mathématiques',
      code: 'MATH101',
      deadline: '24/03/2025 21:33',
      description: 'Examen final couvrant tous les chapitres du semestre. Veuillez soumettre vos réponses en format PDF.'
    },
    {
      title: 'Examen Partiel - Physique',
      code: 'PHYS201',
      deadline: '20/03/2025 21:33',
      description: 'Examen partiel sur la mécanique et l’électromagnétisme.'
    },
    {
      title: 'Contrôle - Informatique',
      code: 'INFO301',
      deadline: '18/03/2025 21:33',
      description: 'Test de programmation et d’algorithmique.'
    },
    {
      title: 'Projet Final - Génie Logiciel',
      code: 'INFO405',
      deadline: '25/03/2025 23:59',
      description: 'Projet final incluant documentation technique, code source et présentation. À soumettre en format ZIP.'
    },
    {
      title: 'Dissertation - Histoire des Sciences',
      code: 'HIST250',
      deadline: '22/03/2025 18:00',
      description: 'Dissertation de 10 pages sur l\'évolution d\'un domaine scientifique de votre choix au cours du 20ème siècle.'
    },
    {
      title: 'Rapport de Laboratoire - Chimie',
      code: 'CHEM202',
      deadline: '19/03/2025 12:00',
      description: 'Compte-rendu détaillé des expériences réalisées pendant le laboratoire sur les réactions organiques.'
    }
  ];

  selectedExam: Exam | null = null;
  selectedFile: File | null = null;

  selectExam(exam: Exam) {
    this.selectedExam = exam;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      alert(`Fichier sélectionné: ${file.name}`);
    } else {
      alert('Veuillez sélectionner un fichier PDF valide.');
    }
  }
}
