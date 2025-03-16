import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformancesComponent } from './performances.component';
//import {ChartsModule } from 'ng2-charts';

describe('PerformancesComponent', () => {
  let component: PerformancesComponent;
  let fixture: ComponentFixture<PerformancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
