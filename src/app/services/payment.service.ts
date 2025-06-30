import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class PaymentService {
private baseUrl = 'http://localhost:8080/api/payments';
 
  constructor(private http: HttpClient) {}
 
  getExpectedTotal(bookingId: number, couponCode?: string): Observable<any> {
    let params = new HttpParams().set('bookingId', bookingId.toString());
    if (couponCode) {
      params = params.set('couponCode', couponCode);
    }
    return this.http.get<any>(`${this.baseUrl}/expected-total`, { params });
  }
 
  processPayment(payment: any, couponCode?: string): Observable<any> {
    let params = new HttpParams();
    if (couponCode) {
      params = params.set('couponCode', couponCode);
    }
return this.http.post(`${this.baseUrl}`, payment, { params });
  }
}