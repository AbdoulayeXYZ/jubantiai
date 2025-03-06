import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamStatisticsComponent } from './exam-statistics.component';

describe('ExamStatisticsComponent', () => {
  let component: ExamStatisticsComponent;
  let fixture: ComponentFixture<ExamStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
