import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  @Component({
    selector: 'app-register', // Vérifie que c'est bien ce nom-là
    templateUrl: './register.component.html',
  })
  

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Simulate processing delay
      setTimeout(() => {
        this.isLoading = false;
        console.log('Form submitted:', this.loginForm.value);
      }, 1000);
    }
  }

  // Helper method to check if the field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Helper method to get error message
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
