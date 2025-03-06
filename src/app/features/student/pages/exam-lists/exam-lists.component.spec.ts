import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamListsComponent } from './exam-lists.component';

describe('ExamListsComponent', () => {
  let component: ExamListsComponent;
  let fixture: ComponentFixture<ExamListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
