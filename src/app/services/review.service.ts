import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'http://localhost:8084/api/reviews';
 
  constructor(private http: HttpClient) {}
 
  getReviewsByPackage(packageId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${packageId}`);
  }
 
  postReview(review: any) {
    return this.http.post(`${this.baseUrl}`, review);
  }
 
  updateReview(reviewId: number, updatedReview: any) {
    return this.http.put(`${this.baseUrl}/${reviewId}`, updatedReview);
  }
 
  deleteReview(reviewId: number) {
    return this.http.delete(`${this.baseUrl}/${reviewId}`);
  }
 
  hasCompletedBooking(userId: number, packageId: number) {
    return this.http.get(`http://localhost:8086/api/bookings/user/${userId}/package/${packageId}/completed`);
  }
 
  hasAlreadyReviewed(userId: number, packageId: number) {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${userId}/${packageId}`);
  }
}
 