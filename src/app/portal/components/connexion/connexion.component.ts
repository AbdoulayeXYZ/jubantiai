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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, LoginComponent, RegisterComponent],
  template: `
    <app-navbar></app-navbar>
    <div *ngIf="isLogin; else registerTemplate">
      <app-login></app-login>
    </div>
    <ng-template #registerTemplate>
      <app-register></app-register>
    </ng-template>
    <button (click)="toggleForm()">{{ isLogin ? 'Switch to Register' : 'Switch to Login' }}</button>
  `,
  styleUrls: ['./connexion.component.css']
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
