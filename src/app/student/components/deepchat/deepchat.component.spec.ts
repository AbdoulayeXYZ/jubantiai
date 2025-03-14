import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepchatComponent } from './deepchat.component';

describe('DeepchatComponent', () => {
  let component: DeepchatComponent;
  let fixture: ComponentFixture<DeepchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeepchatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeepchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
