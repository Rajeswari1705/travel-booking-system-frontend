import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMybookingsComponent } from './customer-mybookings.component';

describe('CustomerMybookingsComponent', () => {
  let component: CustomerMybookingsComponent;
  let fixture: ComponentFixture<CustomerMybookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMybookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMybookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
