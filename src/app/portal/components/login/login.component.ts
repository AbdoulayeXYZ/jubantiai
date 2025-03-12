import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
    ) { }
  
    onSubmit(): void {
      if (this.loginForm.valid) {
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
          },
          error: (error) => {
            console.error('Login failed:', error);
          }
        });
      }
    }
  }
  