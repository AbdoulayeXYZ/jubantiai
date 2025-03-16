import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Enregistrer les composants de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.css'],
  standalone: false
})
export class PerformancesComponent implements AfterViewInit {
  // Données de démonstration pour les performances des classes
  classPerformanceChart = {
    labels: ['DIC1', 'DIC2', 'DIC3'],
    datasets: [
      {
        label: 'Moyenne des scores',
        data: [75, 85, 90],
        backgroundColor: ['#2ecc71', '#3498db', '#9b59b6'],
        borderColor: ['#27ae60', '#2980b9', '#8e44ad'],
        borderWidth: 1,
      },
    ],
  };

  // Données de démonstration pour les performances des étudiants
  studentPerformanceChart = {
    labels: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    datasets: [
      {
        label: 'Score',
        data: [80, 90, 70, 85, 95],
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  constructor() {}

  ngAfterViewInit(): void {
    this.renderClassPerformanceChart();
    this.renderStudentPerformanceChart();
  }

  // Rendre le graphique des performances des classes
  renderClassPerformanceChart(): void {
    const ctx = document.getElementById('classPerformanceChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: this.classPerformanceChart,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
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
        type: 'bar',
        data: this.studentPerformanceChart,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
    } else {
      console.error("Élément 'studentPerformanceChart' non trouvé !");
    }
  }
}