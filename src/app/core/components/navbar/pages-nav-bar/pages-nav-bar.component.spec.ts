import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesNavBarComponent } from './pages-nav-bar.component';

describe('PagesNavBarComponent', () => {
  let component: PagesNavBarComponent;
  let fixture: ComponentFixture<PagesNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
