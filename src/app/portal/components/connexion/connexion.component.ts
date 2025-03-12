import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { LoginComponent } from '../login/login.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent {
}
