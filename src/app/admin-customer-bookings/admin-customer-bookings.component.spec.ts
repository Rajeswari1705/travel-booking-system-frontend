import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerBookingsComponent } from './admin-customer-bookings.component';

describe('AdminCustomerBookingsComponent', () => {
  let component: AdminCustomerBookingsComponent;
  let fixture: ComponentFixture<AdminCustomerBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomerBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomerBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
