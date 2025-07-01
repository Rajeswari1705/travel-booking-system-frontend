import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { BookingService } from '../services/booking.service';
import { Router } from '@angular/router'; // Import Router for redirection if needed

interface Booking {
  bookingId: number;
  status: string;
  packageId: string;
  insuranceId: string | null;
  tripStartDate: string; // Keep as string or convert to Date if needed for more complex logic
  tripEndDate: string;
}

interface User {
  userId: number;
  // Add other user properties that you expect from localStorage
  // e.g., username: string;
  // email: string;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
  imports: [CommonModule, DatePipe] // Add DatePipe to imports for using in template
})
export class MyBookingsComponent implements OnInit {
  userId!: number; // Using definite assignment assertion as it will be initialized in ngOnInit
  bookings: Booking[] = []; // Strongly type the bookings array
  loading = true;
  error = '';

  constructor(
    private bookingService: BookingService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadUserBookings();
  }

  private loadUserBookings(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const user: User = JSON.parse(userData);
        this.userId = user.userId;

        // Check if userId is a valid number
        if (typeof this.userId !== 'number' || isNaN(this.userId)) {
          this.error = 'Invalid user ID found in session. Please log in again.';
          this.loading = false;
          console.error('Parsed userId is not a valid number:', this.userId);
          // Optional: redirect to login if user ID is invalid
          // this.router.navigate(['/login']);
          return;
        }

        this.bookingService.getBookingsByUser(this.userId).subscribe({
          next: (res: Booking[]) => { // Strongly type the response
            this.bookings = res;
            this.loading = false;
            if (this.bookings.length === 0) {
                console.log('No bookings found for user:', this.userId);
            }
          },
          error: (err) => {
            console.error('Failed to load bookings:', err);
            // Provide a more user-friendly error message, extracting from err if possible
            this.error = 'Failed to load bookings. Please try again later.';
            if (err.status === 404) {
              this.error = 'No bookings found or user does not exist.';
            } else if (err.status === 401 || err.status === 403) {
              this.error = 'You are not authorized to view these bookings. Please log in.';
              // Optional: redirect to login for authorization errors
              // this.router.navigate(['/login']);
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
        // Optional: redirect to login if localStorage is corrupted
        // this.router.navigate(['/login']);
      }
    } else {
      this.error = 'User not logged in. Please log in to view your bookings.';
      this.loading = false;
      // Optional: redirect to login if not logged in
      // this.router.navigate(['/login']);
    }
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        alert('Booking cancelled successfully.');
        // Update the status of the cancelled booking in the local array
        this.bookings = this.bookings.map(b =>
          b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b
        );
        // Alternatively, you could reload all bookings to ensure fresh data
        // this.loadUserBookings();
      },
      error: (err) => {
        console.error('Cancellation failed:', err);
        // Improve error message for cancellation
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
    // Ensure tripStartDate is parsed correctly as Date object
    const startDate = new Date(booking.tripStartDate);

    // Check for invalid date (e.g., if tripStartDate is malformed)
    if (isNaN(startDate.getTime())) {
      console.warn(`Invalid trip start date for booking ${booking.bookingId}: ${booking.tripStartDate}`);
      return false;
    }

    // Calculate the threshold date (7 days before start)
    const cancelDeadline = new Date(startDate);
    cancelDeadline.setDate(cancelDeadline.getDate() - 7);
    // Set time to end of day for today and start of day for deadline to ensure comparison accuracy
    today.setHours(0, 0, 0, 0);
    cancelDeadline.setHours(0, 0, 0, 0);

    return (
      booking.status !== 'CANCELLED' && // Cannot cancel if already cancelled
      booking.status !== 'COMPLETED' && // Cannot cancel if trip is completed
      today < startDate &&              // Trip hasn't started yet
      today <= cancelDeadline           // At least 7 days before start date (inclusive of the 7th day)
    );
  }
}