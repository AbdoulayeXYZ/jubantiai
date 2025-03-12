import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnexionComponent } from './components/connexion/connexion.component'; // Import the ConnexionComponent

@NgModule({
  declarations: [
    // ConnexionComponent // Retirer la déclaration de ConnexionComponent

  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
