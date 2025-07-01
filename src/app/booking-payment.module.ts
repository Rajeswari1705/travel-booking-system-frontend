import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
 
import { BookingComponent } from './booking/booking.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
 
@NgModule({
  // declarations: [
    
  // ],
  imports: [
    BookingComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    MyBookingsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class BookingPaymentModule {}