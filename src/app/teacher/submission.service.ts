import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISubmission } from '../interfaces/submission.interface'; // Assuming this interface exists

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = 'http://localhost:3000/api/submissions'; // Update with the correct API endpoint

  constructor(private http: HttpClient) { }

  getSubmissions(): Observable<ISubmission[]> {
    return this.http.get<ISubmission[]>(this.apiUrl);
  }
}
