import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserManageComponent } from './admin-user-manage.component';

describe('AdminUserManageComponent', () => {
  let component: AdminUserManageComponent;
  let fixture: ComponentFixture<AdminUserManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
