import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  constructor(private router: Router) {} // Add constructor for Router

  navigateToLogin() {
    this.router.navigate(['/login']); // Method to navigate to login
  }

  navigateToRegister() {
    this.router.navigate(['/register']); // Method to navigate to register
  }
}
