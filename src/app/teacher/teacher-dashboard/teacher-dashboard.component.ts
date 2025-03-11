import { Component } from '@angular/core';
import { SubmissionService } from '../submission.service'; // Import the submission service
import { ExamService } from '../exam.service'; // Corrected import path for the exam service

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent {
  submissions: any[] = []; // Property to hold submissions
  exams: any[] = []; // Property to hold exams

  constructor(private submissionService: SubmissionService, private examService: ExamService) {}

  ngOnInit() {
    this.fetchSubmissions(); // Fetch submissions on component initialization
    this.fetchExams(); // Fetch exams on component initialization
  }

  fetchSubmissions() {
    this.submissionService.getSubmissions().subscribe((data: any[]) => { // Explicitly define type for data
      this.submissions = data; // Assign fetched submissions to the property
    });
  }

  fetchExams() {
    this.examService.getExams().subscribe((data: any[]) => { // Explicitly define type for data
      this.exams = data; // Assign fetched exams to the property
    });
  }
}
