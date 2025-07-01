import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class PaymentService {
private baseUrl = 'http://localhost:8086/api/payments';
 
  constructor(private http: HttpClient) {}
 
  getExpectedTotal(bookingId: number, couponCode?: string): Observable<any> {
    let url = `${this.baseUrl}/expected-total/${bookingId}`;
    if (couponCode) {
      url += `?couponCode=${couponCode}`;
    }
    return this.http.get<any>(url);
  }
 
  processPayment(payment: any, couponCode?: string): Observable<any> {
    let params = new HttpParams();
    if (couponCode) {
      params = params.set('couponCode', couponCode);
    }
return this.http.post(`${this.baseUrl}`, payment, { params });
  }
}