import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// --- IMPORTANT CHANGE HERE ---
// Import LottieModule for client-side usage of <ng-lottie>
import { LottieComponent } from 'ngx-lottie';
// If you are also doing Server-Side Rendering (SSR), you can keep LottieServerModule
// import { LottieServerModule } from 'ngx-lottie/server';
// --- END IMPORTANT CHANGE ---


@Component({
  selector: 'app-payment-success',
  standalone: true,
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    LottieComponent, // <--- ADD LottieModule HERE
    // LottieServerModule // Keep this only if you need SSR support for Lottie
  ]
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