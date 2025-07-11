import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInsuranceComponent } from './customer-insurance.component';

describe('CustomerInsuranceComponent', () => {
  let component: CustomerInsuranceComponent;
  let fixture: ComponentFixture<CustomerInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
