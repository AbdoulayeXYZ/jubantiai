import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.css']
})
export class ManageStudentsComponent implements OnInit {
  ngOnInit(): void {
    // Implementation of ngOnInit
  }
}
