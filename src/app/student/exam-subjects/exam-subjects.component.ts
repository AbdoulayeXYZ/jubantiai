import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../submission.service';

@Component({
  selector: 'app-exam-subjects',
  templateUrl: './exam-subjects.component.html',
  styleUrls: ['./exam-subjects.component.css']
})
export class ExamSubjectsComponent implements OnInit {
  examSubjects: any[] = []; // Property to hold exam subjects

  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.fetchExamSubjects();
  }

  fetchExamSubjects(): void {
    this.submissionService.getExamSubjects().subscribe(
      (subjects) => {
        this.examSubjects = subjects;
      },
      (error) => {
        console.error('Error fetching exam subjects:', error);
      }
    );
  }
}
