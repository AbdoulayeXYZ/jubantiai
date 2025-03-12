import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class isAdminGuard implements CanActivate {
  canActivate(): boolean {
    // Check if the user is authenticated and has the 'teacher' role
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.type !== 'teacher') {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  constructor(private authService: AuthService, private router: Router) {}
}
