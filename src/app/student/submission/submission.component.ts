import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubmissionService } from '../submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent {
  submissionForm: FormGroup;

  constructor(private fb: FormBuilder, private submissionService: SubmissionService) {
    this.submissionForm = this.fb.group({
      examId: [''],
      filePath: [''],
      // Ajoutez d'autres champs si nécessaire
    });
  }

  onSubmit() {
    this.submissionService.submitExam(this.submissionForm.value).subscribe(response => {
      console.log('Soumission réussie', response);
      // Gérer la réponse après soumission
    }, error => {
      console.error('Erreur lors de la soumission', error);
    });
  }
}
