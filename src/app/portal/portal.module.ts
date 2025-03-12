import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from '../home/home.component'; // Import standalone HomeComponent
import { LoginComponent } from './components/login/login.component'; // Import standalone LoginComponent
import { RegisterComponent } from './components/register/register.component'; // Import standalone RegisterComponent
import { ConnexionComponent } from './components/connexion/connexion.component'; // Import standalone ConnexionComponent

@NgModule({
  imports: [
    CommonModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HomeComponent, // Import standalone HomeComponent
    LoginComponent, // Import standalone LoginComponent
    RegisterComponent, // Import standalone RegisterComponent
    ConnexionComponent // Import standalone ConnexionComponent
  ]
})
export class PortalModule {}
