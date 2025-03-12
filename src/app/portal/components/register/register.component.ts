import { Component } from "@angular/core";
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['student', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      console.log('Données du formulaire:', formValue);
      const registerData = {
        email: formValue.email ?? '',
        password: formValue.password ?? '',
        role: (formValue.role as 'student' | 'teacher') ?? 'student'
      };
      this.authService.register(registerData).subscribe({
        next: (response: { user: { role: string; }; }) => {
          const redirectUrl = response.user.role === 'teacher' 
            ? '/teacher/dashboard' 
            : '/student/dashboard';
          this.router.navigate([redirectUrl]);
        },
        error: (error: any) => {
          console.error('Registration failed:', error);
        }
      });
    }
  }
}
