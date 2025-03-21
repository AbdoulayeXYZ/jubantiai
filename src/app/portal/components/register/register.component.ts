import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service'; // Import AuthService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { // Inject AuthService
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['student', Validators.required]
    });
  }

  // New dropdown for role selection
  get roleOptions() {
    return [
      { value: 'student', label: 'Étudiant' },
      { value: 'teacher', label: 'Enseignant' }
    ];
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      // Call the register method from AuthService
      this.authService.register(this.registerForm.value).subscribe(
        (response: any) => { // Explicitly define the type
          this.isLoading = false;
          console.log('Registration successful:', response);
          // Handle successful registration (e.g., redirect to login)
        },
        (error: any) => { // Explicitly define the type
          this.isLoading = false;
          console.error('Registration failed:', error);
          // Handle registration error (e.g., show error message)
        }
      );
    }
  }

  // Helper method to check if the field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return `Ce champ est requis`;
    if (fieldName === 'email' && field.hasError('email')) return 'Veuillez entrer une adresse email valide';

    return '';
  }
}
