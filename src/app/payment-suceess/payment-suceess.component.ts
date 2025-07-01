import { Component } from '@angular/core';
 
@Component({
  selector: 'app-payment-success',
  template: `
    <div class="card p-4 text-center">
      <h2>Payment Successful 🎉</h2>
      <p>Your booking has been confirmed. A confirmation email has been sent.</p>
      <a class="btn btn-primary mt-3" routerLink="/">Go to Dashboard</a>
    </div>
  `,
})
export class PaymentSuccessComponent {}