import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const jwtToken = authService.getToken();
  
  if (jwtToken) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)
    });
    return next(cloned);
  }
  return next(req);
}