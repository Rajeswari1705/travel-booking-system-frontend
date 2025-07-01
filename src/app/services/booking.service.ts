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
 
  getBookingsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/internal/bookings/user/${userId}`);
  }
}