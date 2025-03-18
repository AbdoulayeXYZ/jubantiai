import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentstatsComponent } from './studentstats.component';

describe('StudentstatsComponent', () => {
  let component: StudentstatsComponent;
  let fixture: ComponentFixture<StudentstatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentstatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
