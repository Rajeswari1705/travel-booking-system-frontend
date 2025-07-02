// my-bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { Router } from '@angular/router';

interface Booking {
  bookingId: number;
  status: string;
  packageId: string;
  insuranceId: string | null;
  tripStartDate: string;
  tripEndDate: string;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  imports: [CommonModule, DatePipe]
})
export class MyBookingsComponent implements OnInit {
  userId!: number;
  bookings: Booking[] = [];
  loading = true;
  error = '';

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserBookings();
  }

  private loadUserBookings(): void {
    // Retrieve userId directly from localStorage
    const userIdFromStorage = localStorage.getItem('userId');

    if (userIdFromStorage) {
      try {
        this.userId = parseInt(userIdFromStorage, 10); // Parse the string to a number

        if (typeof this.userId !== 'number' || isNaN(this.userId)) {
          this.error = 'Invalid user ID found in session. Please log in again.';
          this.loading = false;
          console.error('Parsed userId is not a valid number:', this.userId);
          // Optional: this.router.navigate(['/login']);
          return;
        }

        this.bookingService.getBookingsByUserId(this.userId).subscribe({
          next: (res: Booking[]) => {
            this.bookings = res;
            this.loading = false;
            if (this.bookings.length === 0) {
                console.log('No bookings found for user:', this.userId);
            }
          },
          error: (err) => {
            console.error('Failed to load bookings:', err);
            this.error = 'Failed to load bookings. Please try again later.';
            if (err.status === 404) {
              this.error = 'No bookings found or user does not exist.';
            } else if (err.status === 401 || err.status === 403) {
              this.error = 'You are not authorized to view these bookings. Please log in.';
              // Optional: this.router.navigate(['/login']);
            } else if (err.error && typeof err.error === 'string') {
                this.error = `Failed to load bookings: ${err.error}`;
            }
            this.loading = false;
          }
        });
      } catch (e) {
        console.error('Failed to parse user data from localStorage:', e);
        this.error = 'User session data is corrupted. Please log in again.';
        this.loading = false;
        // Optional: this.router.navigate(['/login']);
      }
    } else {
      this.error = 'User not logged in. Please log in to view your bookings.';
      this.loading = false;
      // Optional: this.router.navigate(['/login']);
    }
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        alert('Booking cancelled successfully.');
        this.bookings = this.bookings.map(b =>
          b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
        );
      },
      error: (err) => {
        console.error('Cancellation failed:', err);
        let errorMessage = 'Cancellation failed. Please try again.';
        if (err.error && typeof err.error === 'string') {
          errorMessage = `Cancellation failed: ${err.error}`;
        } else if (err.message) {
          errorMessage = `Cancellation failed: ${err.message}`;
        }
        alert(errorMessage);
      }
    });
  }

  canCancel(booking: Booking): boolean {
    const today = new Date();
    const startDate = new Date(booking.tripStartDate);
    if (isNaN(startDate.getTime())) {
      console.warn(`Invalid trip start date for booking ${booking.bookingId}: ${booking.tripStartDate}`);
      return false;
    }

    const cancelDeadline = new Date(startDate);
    cancelDeadline.setDate(cancelDeadline.getDate() - 7);
    today.setHours(0, 0, 0, 0);
    cancelDeadline.setHours(0, 0, 0, 0);

    return (
      booking.status !== 'CANCELLED' &&
      booking.status !== 'COMPLETED' &&
      today < startDate &&
      today <= cancelDeadline
    );
  }
}