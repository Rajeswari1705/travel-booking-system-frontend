import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LottieServerModule } from 'ngx-lottie/server';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  imports: [CommonModule, RouterModule, LottieServerModule]
})
export class PaymentSuccessComponent implements OnInit {
  userName!: string;
  bookingId!: number;
  packageTitle!: string;
  tripStartDate!: string;
  tripEndDate!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.userName = state['userName'];
      this.bookingId = state['bookingId'];
      this.packageTitle = state['packageTitle'];
      this.tripStartDate = state['tripStartDate'];
      this.tripEndDate = state['tripEndDate'];
    }
  }
}