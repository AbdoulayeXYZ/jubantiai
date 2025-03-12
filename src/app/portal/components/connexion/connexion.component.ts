import { CommonModule } from '@angular/common';
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
  styleUrls: ['./connexion.component.css'], // Correction ici
  // imports: [] // Retirer la section imports



})
export class ConnexionComponent {
  isLogin: boolean = true; // Track whether to show login or register
  form: FormGroup; // Declare the form property

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Define your form controls here
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin; // Toggle between login and register
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
