import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';


@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css',
  imports: [
    ReactiveFormsModule, CommonModule, RouterModule, SharedModule
  ]
})
export class ConnexionComponent {
}