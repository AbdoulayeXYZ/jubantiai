import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { TakeExamComponent } from './take-exam/take-exam.component';
import { ExamResultsComponent } from './exam-results/exam-results.component';

const routes: Routes = [
  {
    path: '',
    component: ExamListComponent
  },
  {
    path: ':id',
    component: ExamDetailsComponent
  },
  {
    path: ':id/take',
    component: TakeExamComponent
  },
  {
    path: ':id/results',
    component: ExamResultsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ExamListComponent,
    ExamDetailsComponent,
    TakeExamComponent,
    ExamResultsComponent
  ]
})
export class ExamModule { } 