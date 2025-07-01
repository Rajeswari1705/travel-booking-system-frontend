import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSuceessComponent } from './payment-suceess.component';

describe('PaymentSuceessComponent', () => {
  let component: PaymentSuceessComponent;
  let fixture: ComponentFixture<PaymentSuceessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSuceessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSuceessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
