import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../submission.service'; // Correct import path for the submission service



@Component({
  selector: 'app-view-submissions',
  templateUrl: './view-submissions.component.html',
  styleUrls: ['./view-submissions.component.css']
})
export class ViewSubmissionsComponent implements OnInit {
  submissions: any[] = []; // Array to hold submissions

  constructor(private submissionService: SubmissionService) { } // Inject the submission service

  ngOnInit(): void {
    this.loadSubmissions(); // Load submissions on component initialization
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe((data: any) => {


console.log('Fetched submissions:', data); // Log the fetched data for inspection
console.log('Fetched submissions:', data); // Log the fetched data for inspection
this.submissions = data; // Assign the fetched submissions to the array


    }, (error: any) => {


      console.error('Error fetching submissions', error); // Handle error
    });
  }
}
