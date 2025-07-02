import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { TravelPackageService } from '../services/package.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls:['./booking.component.css'],
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BookingComponent implements OnInit {
  bookingForm!: FormGroup;
  userId!: number; // Now initialized from localStorage
  packageId!: number;
  tripStartDate!: string;
  tripEndDate!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private packageService: TravelPackageService
  ) {}

  ngOnInit(): void {
    // Retrieve userId from localStorage
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      this.userId = parseInt(userIdFromStorage, 10);
      if (isNaN(this.userId)) {
        console.error('Invalid userId found in localStorage. Redirecting to login.');
        alert('Invalid user session. Please log in again.');
        this.router.navigate(['/login']); // Redirect to login if userId is invalid
        return; // Stop further execution if userId is invalid
      }
    } else {
      console.error('userId not found in localStorage. Redirecting to login.');
      alert('User not logged in. Please log in to book a package.');
      this.router.navigate(['/login']); // Redirect to login if userId is not found
      return; // Stop further execution if userId is not found
    }

    const stateData = history.state?.packageData;
    if (stateData && stateData.packageId) {
      this.setPackageDetails(stateData);
    } else {
      const paramId = this.route.snapshot.paramMap.get('packageId');
      if (paramId) {
        this.packageId = +paramId;
        this.fetchPackageFromBackend(this.packageId);
      } else {
        alert('Package not found. Redirecting to dashboard.');
        this.router.navigate(['/customer-dashboard']);
      }
    }

    this.bookingForm = this.fb.group({
      insuranceId: ['']
    });
  }

  setPackageDetails(pkg: any) {
    this.packageId = pkg.packageId;
    this.tripStartDate = pkg.tripStartDate;
    this.tripEndDate = pkg.tripEndDate;
  }

  fetchPackageFromBackend(id: number) {
    this.packageService.getPackageById(id).subscribe({
      next: (pkg) => {
        this.setPackageDetails({
          packageId: pkg.packageId,
          tripStartDate: pkg.tripStartDate,
          tripEndDate: pkg.tripEndDate
        });
      },
      error: () => {
        alert('Unable to fetch package details.');
        this.router.navigate(['/customer-dashboard']);
      }
    });
  }

  bookPackage() {
    const payload = {
      userId: this.userId, // Now dynamically retrieved
      packageId: this.packageId,
      insuranceId: this.bookingForm.value.insuranceId || null,
      tripStartDate: this.tripStartDate,
      tripEndDate: this.tripEndDate
    };

    console.log('Booking payload:', payload);

    this.bookingService.createBooking(payload).subscribe({
      next: (res) => {
        alert('Booking Created!');
        this.router.navigate(['/payment'], {
          state: { bookingId: res.bookingId, userId: res.userId }
        });
      },
      error: (err) => {
        console.error('Booking failed:', err);

        const errorMsg =
          err?.error?.message ||
          err?.message ||
          err?.statusText ||
          'Something went wrong.';

        alert('Booking failed: ' + errorMsg);
      }
    });
  }
}