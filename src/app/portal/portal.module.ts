import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/connexion/connexion.component';


@NgModule({
  imports: [
    CommonModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    RegisterComponent,
    LoginComponent,
    HomeComponent
  ],
})
export class PortalModule { }
