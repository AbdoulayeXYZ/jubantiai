import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ConnexionComponent } from './components/connexion/connexion.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,  // Vérifie que ce nom est correct
    ConnexionComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule
  ],
  exports: [  // Ajoute ceci si d'autres modules doivent utiliser ces composants
    LoginComponent,
    RegisterComponent,
    ConnexionComponent
  ]
})
export class PortalModule { }
