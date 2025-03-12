import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmissionService } from '../submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SubmissionComponent {
  submissionForm: FormGroup;

  constructor(private fb: FormBuilder, private submissionService: SubmissionService) {
    this.submissionForm = this.fb.group({
      examId: ['', Validators.required],
      filePath: ['', Validators.required],

      // Ajoutez d'autres champs si nécessaire
    });
  }

  onSubmit() {
    this.submissionService.submitExam(this.submissionForm.value).subscribe(response => {
      alert('Soumission réussie !');
      this.submissionForm.reset(); // Réinitialiser le formulaire après soumission

      // Gérer la réponse après soumission
    }, error => {
      alert('Erreur lors de la soumission. Veuillez réessayer.');

    });
  }
}
