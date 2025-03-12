import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './components/connexion/connexion.component'; // Import the ConnexionComponent
import { RegisterComponent } from './components/register/register.component'; // Import the RegisterComponent
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Add routing for the auth module
  ]
})
export class AuthModule { }
