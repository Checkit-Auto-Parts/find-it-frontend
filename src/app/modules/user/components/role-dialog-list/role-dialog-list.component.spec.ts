import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDialogListComponent } from './role-dialog-list.component';

describe('RoleDialogListComponent', () => {
  let component: RoleDialogListComponent;
  let fixture: ComponentFixture<RoleDialogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleDialogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDialogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
