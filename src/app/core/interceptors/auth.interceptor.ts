import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    console.log('Token in interceptor:', token);

    if (token) {
      let clonedRequest: HttpRequest<unknown>;

      // Ne pas ajouter Content-Type pour les requêtes multipart/form-data
      if (request.url.includes('/exams') && request.method === 'POST') {
        clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Multipart request headers:', clonedRequest.headers.get('Authorization'));
      } else {
        clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('JSON request headers:', clonedRequest.headers.get('Authorization'));
      }

      return next.handle(clonedRequest).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            console.log('Response status:', event.status);
            console.log('Response headers:', event.headers);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Error in interceptor:', error.status);
          if (error.status === 401) {
            console.log('401 error detected, current token:', token);
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
          return throwError(() => error);
        })
      );
    }

    console.log('No token available, proceeding without authentication');
    return next.handle(request);
  }
} 