import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobileMenuOpen: boolean = false;

  // Fonction pour basculer le menu mobile
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
