import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls:['./payment.component.css'],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})

export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  bookingId!: number;
  userId!: number;
  expectedTotal: number = 0;
  showTotal = false;
 
  constructor(private fb: FormBuilder, private paymentService: PaymentService, private router: Router) {}
 
  ngOnInit(): void {
    const state = history.state;
    this.bookingId = state.bookingId;
    this.userId = state.userId;
 
this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      atmPin: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      paymentMethod: ['Credit Card', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      couponCode: ['']
    });
 
    this.fetchExpectedTotal();
  }
 
  fetchExpectedTotal() {
    const coupon = this.paymentForm.get('couponCode')?.value || '';
    this.paymentService.getExpectedTotal(this.bookingId, coupon).subscribe({
      next: (res) => {
        this.expectedTotal = res.totalPayable;
        this.showTotal = true;
      },
      error: (err) => alert('Failed to fetch total: ' + err.error.message)
    });
  }
 
  submitPayment() {
    const payment = {
      ...this.paymentForm.value,
      bookingId: this.bookingId,
      userId: this.userId,
      currency: 'INR'
    };
 
    if (Number(payment.amount) !== Number(this.expectedTotal)) {
      alert(`Amount mismatch! Expected to pay: ₹${this.expectedTotal}`);
      return;
    }
 
    this.paymentService.processPayment(payment, payment.couponCode).subscribe({
      next: () => this.router.navigate(['/payment-success']),
      error: (err) => alert('Payment failed: ' + err.error.message)
    });
  }
}