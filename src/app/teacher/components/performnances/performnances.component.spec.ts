import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformnancesComponent } from './performnances.component';

describe('PerformnancesComponent', () => {
  let component: PerformnancesComponent;
  let fixture: ComponentFixture<PerformnancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformnancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformnancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
