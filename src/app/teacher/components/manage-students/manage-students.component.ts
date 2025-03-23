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
  // Properties for student management
  students: User[] = [];
  filteredStudents: User[] = []; // New property to store filtered/sorted students
  studentForm!: FormGroup;
  showForm = false;
  isEditMode = false;
  isSubmitting = false;
  isLoading = true;
  successMessage = '';
  errorMessage = '';
  selectedStudent: User | null = null;
  
  // Pagination properties
  currentPage = 1;
  pageSize = 25; // Changed from 10 to 25
  totalPages = 1;
  totalStudents = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadStudents();
  }

  // Initialize the form
  initForm(): void {
    this.studentForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Load students with pagination
  loadStudents(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Filter only student users
        this.students = users.filter(user => user.role === 'student');
        
        // Sort students by lastName
        this.students.sort((a, b) => {
          return a.lastName.localeCompare(b.lastName);
        });
        
        this.totalStudents = this.students.length;
        this.totalPages = Math.ceil(this.totalStudents / this.pageSize);
        this.applyPagination(); // Apply pagination to get current page students
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load students. Please try again.';
        this.isLoading = false;
        console.error('Error loading students:', error);
      }
    });
  }

  // Apply pagination to get current page students
  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalStudents);
    this.filteredStudents = this.students.slice(startIndex, endIndex);
  }

  // Get sequential index for display
  getSequentialIndex(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  // Show add student form
  showAddForm(): void {
    this.isEditMode = false;
    this.showForm = true;
    this.resetForm();
  }

  // Cancel form and hide it
  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  // Reset form to initial state
  resetForm(): void {
    this.studentForm.reset();
    if (this.isEditMode) {
      // Remove password validation for edit mode
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('password')?.updateValueAndValidity();
    } else {
      // Add password validation for add mode
      this.studentForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.studentForm.get('password')?.updateValueAndValidity();
    }
  }

  // Check if a form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Edit student
  editStudent(student: User): void {
    this.isEditMode = true;
    this.selectedStudent = student;
    this.showForm = true;
    
    // Remove password validation for edit mode
    this.studentForm.get('password')?.clearValidators();
    this.studentForm.get('password')?.updateValueAndValidity();
    
    // Set form values
    this.studentForm.patchValue({
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName
    });
  }

  // Confirm delete student
  confirmDelete(student: User): void {
    if (confirm(`Are you sure you want to delete ${student.email}?`)) {
      this.deleteStudent(student);
    }
  }

  // Delete student
  deleteStudent(student: User): void {
    this.userService.deleteUser(student.id.toString()).subscribe({
      next: () => {
        this.successMessage = `Student ${student.email} has been deleted successfully.`;
        this.loadStudents();
        // Clear message after 3 seconds
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        // Display a more specific error message based on the API limitation
        this.errorMessage = 'Delete operation is not supported by the API. Please contact the administrator.';
        console.error('Error deleting student:', error);
        // Clear message after 3 seconds
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // Form submission handler
  onSubmit(): void {
    if (this.studentForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    
    if (this.isEditMode && this.selectedStudent) {
      // Update existing student
      const updatedStudent: User = {
        ...this.selectedStudent,
        email: this.studentForm.value.email,
        firstName: this.studentForm.value.firstName,
        lastName: this.studentForm.value.lastName,
        password: this.studentForm.value.password || 'tempPassword123', // Provide a default password
        role: 'student', // Ensure role is included with correct type
        type: 'user' // Ensure type field is included
      };
      
      this.userService.updateUser(this.selectedStudent.id.toString(), updatedStudent).subscribe({
        next: () => {
          this.successMessage = 'Student updated successfully.';
          this.showForm = false;
          this.loadStudents();
          this.isSubmitting = false;
          // Clear message after 3 seconds
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          // Display a more specific error message based on the API limitation
          this.errorMessage = 'Update operation may not be fully supported by the API. Please try adding a new student instead.';
          this.isSubmitting = false;
          console.error('Error updating student:', error);
          // Clear message after 3 seconds
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    } else {
      // Add new student
      const newStudent: User = {
        email: this.studentForm.value.email,
        firstName: this.studentForm.value.firstName,
        lastName: this.studentForm.value.lastName,
        password: this.studentForm.value.password,
        role: 'student',
        type: 'user', // Required by the backend
        id: 0 // The backend will assign the actual ID
      };
      
      this.userService.addUser(newStudent).subscribe({
        next: () => {
          this.successMessage = 'Student added successfully.';
          this.showForm = false;
          this.loadStudents();
          this.isSubmitting = false;
          // Clear message after 3 seconds
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to add student. Please try again.';
          this.isSubmitting = false;
          console.error('Error adding student:', error);
          // Clear message after 3 seconds
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  // Pagination methods
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination(); // Re-apply pagination when page changes
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}