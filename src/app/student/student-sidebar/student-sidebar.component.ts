import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-sidebar', // Doit correspondre au template
  standalone: false,
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent {
  constructor(private router: Router) {}

  logout() {
    // Implémentez votre logique de déconnexion ici
    // Par exemple :
    // this.authService.logout();
    this.router.navigate(['/login']);
  }
}
