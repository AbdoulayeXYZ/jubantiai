import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeekchatComponent } from './deekchat.component';

describe('DeekchatComponent', () => {
  let component: DeekchatComponent;
  let fixture: ComponentFixture<DeekchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeekchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeekchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
