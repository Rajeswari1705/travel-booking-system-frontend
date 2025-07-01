import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
 
@Component({ selector: 'app-my-bookings', templateUrl: './my-bookings.component.html' })
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  userId = 2;
 
  constructor(private bookingService: BookingService) {}
 
  ngOnInit(): void {
    this.bookingService.getBookingsByUser(this.userId).subscribe({
      next: (res) => this.bookings = res,
      error: (err) => alert('Failed to load bookings: ' + err.error.message)
    });
  }
}