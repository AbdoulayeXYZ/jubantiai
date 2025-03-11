// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['student', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      // Simulate processing delay
      setTimeout(() => {
        this.isLoading = false;
        console.log('Form submitted:', this.registerForm.value);
      }, 1000);
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