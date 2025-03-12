import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    LoginComponent,
    RegisterComponent,
    SharedModule
    

  ]
})
export class PortalModule { }
