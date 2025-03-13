import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, NgModule} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData = {
        email: this.loginForm.get('email')?.value ?? '',
        password: this.loginForm.get('password')?.value ?? ''
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          const redirectUrl = response.user.role === 'teacher' 
            ? '/teacher/dashboard' 
            : '/student/dashboard';
          this.router.navigate([redirectUrl]);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.isLoading = false;
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field) return '';
    
    if (fieldName === 'email') {
      if (field.hasError('required')) return 'Email est requis';
      if (field.hasError('email')) return 'Veuillez entrer une adresse email valide';
    }
    
    if (fieldName === 'password') {
      if (field.hasError('required')) return 'Mot de passe est requis';
    }
    
    return '';
  }
}
