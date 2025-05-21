import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionMessageComponent } from './decision-message.component';

describe('DecisionMessageComponent', () => {
  let component: DecisionMessageComponent;
  let fixture: ComponentFixture<DecisionMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
