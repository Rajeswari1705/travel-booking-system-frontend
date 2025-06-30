import { LocalDate } from '@js-joda/core'; // You might need a date library or use string for simplicity

export interface Booking {
  bookingId?: number;
  userId: number;
  packageId: number;
  tripStartDate: string; // ISO date string 'YYYY-MM-DD'
  tripEndDate: string;   // ISO date string 'YYYY-MM-DD'
  status?: string; // e.g., "PENDING", "CONFIRMED", "CANCELLED"
  paymentId?: number;
  insuranceId?: number;
}

export interface BookingDTO {
  bookingId?: number;
  userId: number;
  packageId: number;
  tripStartDate: string;
  tripEndDate: string;
  status?: string;
  paymentId?: number;
  insuranceId?: number;
}