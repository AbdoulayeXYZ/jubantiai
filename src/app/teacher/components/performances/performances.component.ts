import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

// Enregistrer les composants de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.css'],
  standalone:false
})
export class PerformancesComponent implements OnInit {
  // Données de démonstration pour les performances des classes
  classPerformanceData = {
    labels: ['DIC1', 'DIC2', 'DIC3'], // Noms des classes
    datasets: [
      {
        label: 'Moyenne des scores',
        data: [75, 85, 90], // Moyennes des scores par classe
        backgroundColor: ['#2ecc71', '#3498db', '#9b59b6'], // Couleurs des barres
        borderColor: ['#27ae60', '#2980b9', '#8e44ad'], // Couleurs des bordures
        borderWidth: 1,
      },
    ],
  };

  // Données de démonstration pour les performances des étudiants
  studentPerformanceData = {
    labels: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'], // Noms des étudiants
    datasets: [
      {
        label: 'Score',
        data: [80, 90, 70, 85, 95], // Scores des étudiants
        backgroundColor: '#e74c3c', // Couleur de la ligne
        borderColor: '#c0392b', // Couleur de la bordure
        borderWidth: 2,
        fill: false, // Ne pas remplir sous la ligne
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    this.renderClassPerformanceChart();
    this.renderStudentPerformanceChart();
  }

  // Rendre le graphique des performances des classes
  renderClassPerformanceChart(): void {
    const ctx = document.getElementById('classPerformanceChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar', // Type de graphique : barres
        data: this.classPerformanceData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100, // Valeur maximale de l'axe Y
            },
          },
        },
      });
    } else {
      console.error("Élément 'classPerformanceChart' non trouvé !");
    }
  }

  // Rendre le graphique des performances des étudiants
  renderStudentPerformanceChart(): void {
    const ctx = document.getElementById('studentPerformanceChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line', // Type de graphique : ligne
        data: this.studentPerformanceData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100, // Valeur maximale de l'axe Y
            },
          },
        },
      });
    } else {
      console.error("Élément 'studentPerformanceChart' non trouvé !");
    }
  }
}