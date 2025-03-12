import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class isAdminGuard implements CanActivate {
  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.type !== 'student') {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  constructor(private authService: AuthService, private router: Router) {}
}
