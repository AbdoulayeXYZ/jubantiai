import { Component, OnInit } from '@angular/core';

interface Student {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  classe: string;
}

@Component({
  standalone: true,
  selector: 'app-manage-students', // Corrigé pour correspondre à "app-manage-students"
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.css']
})
export class ManageStudentsComponent implements OnInit {
  dummyStudents: Student[] = [];
  filteredStudents: Student[] = [];
  selectedClass: string = 'Tous';
  isLoading: boolean = true;
  showEmptyState: boolean = false;
  showError: boolean = false;

  ngOnInit(): void {
    // Simulate loading data
    setTimeout(() => {
      this.loadDummyData();
      this.isLoading = false;
    }, 1500);
  }

  loadDummyData(): void {
    // Sample data
    this.dummyStudents = [
      { id: 1, nom: 'Diop', prenom: 'Fatou', email: 'fatou.diop@example.com', classe: 'DIC1' },
      { id: 2, nom: 'Ndiaye', prenom: 'Ousmane', email: 'ousmane.ndiaye@example.com', classe: 'DIC1' },
      { id: 3, nom: 'Fall', prenom: 'Aminata', email: 'aminata.fall@example.com', classe: 'DIC2' },
      { id: 4, nom: 'Sow', prenom: 'Ibrahima', email: 'ibrahima.sow@example.com', classe: 'DIC2' },
      { id: 5, nom: 'Mbaye', prenom: 'Mariama', email: 'mariama.mbaye@example.com', classe: 'DIC3' },
      { id: 6, nom: 'Gueye', prenom: 'Mamadou', email: 'mamadou.gueye@example.com', classe: 'DIC3' },
      { id: 7, nom: 'Sarr', prenom: 'Aïssatou', email: 'aissatou.sarr@example.com', classe: 'DIC1' },
      { id: 8, nom: 'Ba', prenom: 'Cheikh', email: 'cheikh.ba@example.com', classe: 'DIC2' }
    ];
    this.filteredStudents = [...this.dummyStudents];
  }

  filterByClass(classFilter: string): void {
    this.selectedClass = classFilter;
    if (classFilter === 'Tous') {
      this.filteredStudents = [...this.dummyStudents];
    } else {
      this.filteredStudents = this.dummyStudents.filter(student => student.classe === classFilter);
    }
    this.showEmptyState = this.filteredStudents.length === 0;
  }

  searchStudents(searchTerm: string): void {
    if (!searchTerm) {
      this.filterByClass(this.selectedClass);
      return;
    }

    searchTerm = searchTerm.toLowerCase();
    let results = this.dummyStudents;

    if (this.selectedClass !== 'Tous') {
      results = results.filter(student => student.classe === this.selectedClass);
    }

    this.filteredStudents = results.filter(student =>
      student.nom.toLowerCase().includes(searchTerm) ||
      student.prenom.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    );

    this.showEmptyState = this.filteredStudents.length === 0;
  }

  retryLoading(): void {
    this.isLoading = true;
    this.showError = false;

    // Simulate loading again
    setTimeout(() => {
      this.loadDummyData();
      this.isLoading = false;
    }, 1500);
  }

  addStudent(): void {
    console.log('Add student functionality will be implemented');
  }

  editStudent(studentId: number): void {
    console.log('Edit student:', studentId);
  }

  deleteStudent(studentId: number): void {
    console.log('Delete student:', studentId);
  }

  viewStudentDetails(studentId: number): void {
    console.log('View student details:', studentId);
  }
}
