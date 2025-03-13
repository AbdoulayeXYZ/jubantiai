import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-sidebar', // Doit correspondre au template
  standalone: false,
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.css']
})
export class TeacherSidebarComponent {
  constructor(private router: Router) {}

  logout() {
    // Implémentez votre logique de déconnexion ici
    // Par exemple :
    // this.authService.logout();
    this.router.navigate(['/login']);
  }
}
