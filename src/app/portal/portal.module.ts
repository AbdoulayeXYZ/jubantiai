import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    ConnexionComponent,
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    RegisterComponent,
    LoginComponent
  ],
})
export class PortalModule { }
