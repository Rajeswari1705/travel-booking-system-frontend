import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class BookingService {
private api = 'http://localhost:8086/api/bookings';
 
  constructor(private http: HttpClient) {}
 
  createBooking(data: any): Observable<any> {
return this.http.post<any>(this.api, data);
  }
 
  getBookingById(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }
 
  getBookingsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/internal/bookings/user/${userId}`);
  }
  
  cancelBooking(bookingId: number): Observable<string> {
    return this.http.put(`${this.api}/cancel/${bookingId}`, null, {
      responseType: 'text'
    });
  }
}