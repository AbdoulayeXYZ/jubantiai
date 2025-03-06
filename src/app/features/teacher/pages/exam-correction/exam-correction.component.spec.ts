import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCorrectionComponent } from './exam-correction.component';

describe('ExamCorrectionComponent', () => {
  let component: ExamCorrectionComponent;
  let fixture: ComponentFixture<ExamCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamCorrectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
