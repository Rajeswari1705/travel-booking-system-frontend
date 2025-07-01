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
  userId = 2; // To be replaced with Auth
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
      userId: this.userId,
      packageId: this.packageId,
      insuranceId: this.bookingForm.value.insuranceId || null,
      tripStartDate: this.tripStartDate,
      tripEndDate: this.tripEndDate
    };
 
    console.log('Booking payload:', payload); // ✅ Inspect in browser console
 
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
          err?.error?.message ||         // proper error body (e.g., from ApiResponse)
          err?.message ||                // generic message (e.g., HttpClient)
          err?.statusText ||             // fallback HTTP status
          'Something went wrong.';
   
        alert('Booking failed: ' + errorMsg);
      }
    });
  }
}
 