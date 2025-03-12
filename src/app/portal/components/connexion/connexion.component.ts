import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service'; // Import AuthService
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-connexion',
  standalone: true,
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})

export class ConnexionComponent {
  isLogin: boolean = true; // Track whether to show login or register
  form: FormGroup; // Declare the form property

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      // Define your form controls here
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin; // Toggle between login and register
  }

  onSubmit() {
    if (this.form.valid) {
      // Call the login method from AuthService
      this.authService.login(this.form.value).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          // Handle successful login (e.g., redirect to home)
        },
        (error: any) => {
          console.error('Login failed:', error);
          // Handle login error (e.g., show error message)
        }
      );
    }
  }
}
