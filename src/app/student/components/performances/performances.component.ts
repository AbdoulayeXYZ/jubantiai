import { Component } from '@angular/core';

@Component({
  selector: 'app-performances',
  standalone: false,
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.css'
})
export class PerformancesComponent {
  performances = [
    { examName: 'Mathématiques', grade: 85, comment: 'Bon travail' },
    { examName: 'Physique', grade: 90, comment: 'Excellent' },
    { examName: 'Chimie', grade: 78, comment: 'Peut mieux faire' },
  ];
}
