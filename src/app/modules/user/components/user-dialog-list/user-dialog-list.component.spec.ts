import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialogListComponent } from './user-dialog-list.component';

describe('UserDialogListComponent', () => {
  let component: UserDialogListComponent;
  let fixture: ComponentFixture<UserDialogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDialogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDialogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
