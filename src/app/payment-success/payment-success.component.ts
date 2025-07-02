import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'; // Import ActivatedRoute and ParamMap
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class PaymentSuccessComponent implements OnInit {
  // Initialize properties with default values (e.g., empty strings)
  // This helps prevent "undefined" errors in the template if data isn't found.
  userName: string = '';
  bookingId: string = ''; // Keeping as string as it comes from URL
  packageTitle: string = '';
  tripStartDate: string = '';
  tripEndDate: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute to read route parameters
  ) {}

  ngOnInit(): void {
    // Subscribe to queryParamMap to get parameters from the URL
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.userName = params.get('userName') || '';
      this.bookingId = params.get('bookingId') || '';
      this.packageTitle = params.get('packageTitle') || '';
      this.tripStartDate = params.get('tripStartDate') || '';
      this.tripEndDate = params.get('tripEndDate') || '';

      // --- Important: Add a check for critical data ---
      // If bookingId is essential and might be missing, consider redirecting
      if (!this.bookingId) {
        console.warn('Booking ID not found in URL. This might be a direct access or missing data.');
        // Optionally, redirect the user to a more appropriate page, e.g., home or a transaction history.
        // this.router.navigate(['/']); // Redirect to homepage
      }
    });
  }
}