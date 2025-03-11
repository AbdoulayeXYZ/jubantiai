import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Vérifie si l'utilisateur a le bon rôle pour la route
      const requiredRole = route.data['role'];
      if (requiredRole) {
        const user = this.authService.getCurrentUser();
        if (user?.role !== requiredRole) {
          // Redirige vers le dashboard approprié
          this.router.navigate([`/${user?.role}/dashboard`]);
          return false;
        }
      }
      return true;
    }

    // Non authentifié, redirige vers la page de connexion
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
} 