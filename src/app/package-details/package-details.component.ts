import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor (already there)

// Import the BookingService and Booking model
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model'; // Assuming this path and model structure

// Assuming TravelPackage is an interface similar to TravelPackageDTO
// import { TravelPackage } from '../models/travel-package'; // Keep your existing import if TravelPackage is your DTO name

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})
export class PackageDetailsComponent implements OnInit {
  packageId!: number;
  packageDetails: any; // Using 'any' as per your code, but ideally TravelPackageDTO or your defined TravelPackage interface
  errorMessage: string = '';
  successMessage: string = '';

  // IMPORTANT: Replace with actual authenticated user ID from your AuthService
  currentUserId: number = 1; // <--- FOR DEMONSTRATION ONLY. GET THIS FROM AUTH SERVICE!

  constructor(
    private route: ActivatedRoute,
    private packageService: TravelPackageService, // Your existing service for package details
    private router: Router,
    private bookingService: BookingService // Inject the BookingService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('packageId');
    if (idParam) {
      this.packageId = Number(idParam);
      console.log('Opened Package ID:', this.packageId);

      this.packageService.getPackageById(this.packageId).subscribe({
        next: (response: any) => {
          console.log('Fetched package details:', response);
          this.packageDetails = response.data || response;
        },
        error: (err) => {
          console.error('Failed to fetch package details', err);
          this.packageDetails = undefined;
          this.errorMessage = 'Failed to load package details.'; // Display error to user
        }
      });
    } else {
      console.error('Package ID not found in route parameters.');
      this.packageDetails = undefined;
      this.errorMessage = 'Package not found.'; // Display error to user
      this.router.navigate(['/customer-dashboard']);
    }
  }

  // Ensure these methods pass a number for packageId
  goToReview(): void {
    if (this.packageId) {
      this.router.navigate(['/review-dashboard', this.packageId]);
    }
  }

  // --- MODIFIED: goToBooking() method ---
  goToBooking(): void {
    if (!this.packageDetails) {
      this.errorMessage = 'Cannot book: Package details not loaded.';
      return;
    }

    if (!this.currentUserId) {
      this.errorMessage = 'User not logged in. Please log in to book a package.';
      // Optionally, redirect to login page here: this.router.navigate(['/login']);
      return;
    }

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Construct the booking object
    const newBooking: Booking = {
      userId: this.currentUserId,
      packageId: this.packageDetails.packageId,
      tripStartDate: this.packageDetails.tripStartDate,
      tripEndDate: this.packageDetails.tripEndDate,
      status: 'PENDING' // Initial status before payment
      // You can add insuranceId here if you implement insurance selection on this page
    };

    console.log('Attempting to create booking:', newBooking);

    // Call the booking service to create the booking
    this.bookingService.createBooking(newBooking).subscribe({
      next: (bookingDto) => {
        this.successMessage = `Booking initiated! Booking ID: ${bookingDto.bookingId}. Redirecting to payment...`;
        console.log('Booking created successfully:', bookingDto);

        // Redirect to the payment component
        // Ensure your payment route in app.routes.ts is like: 'payment/:bookingId/:userId'
        this.router.navigate(['/payment', bookingDto.bookingId, bookingDto.userId]);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create booking. Please try again.';
        console.error('Error creating booking:', err);
      }
    });
  }

  addInsurance(): void {
    if (this.packageId) {
      this.router.navigate(['/insurance', this.packageId]);
    }
  }
}