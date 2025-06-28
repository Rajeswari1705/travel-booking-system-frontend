// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
 
// @Injectable({ providedIn: 'root' })
// export class ReviewService {
//   private baseUrl = 'http://localhost:8084/api/reviews';
 
//   constructor(private http: HttpClient) {}
 
//   getReviewsByPackage(packageId: number) {
//     return this.http.get<any[]>(`${this.baseUrl}/${packageId}`);
//   }
 
//   postReview(review: any) {
//     return this.http.post(`${this.baseUrl}`, review);
//   }
 
//   updateReview(reviewId: number, updatedReview: any) {
//     return this.http.put(`${this.baseUrl}/${reviewId}`, updatedReview);
//   }
 
//   deleteReview(reviewId: number) {
//     return this.http.delete(`${this.baseUrl}/${reviewId}`);
//   }
 
//   hasCompletedBooking(userId: number, packageId: number) {
//     return this.http.get(`http://localhost:8086/api/bookings/user/${userId}/package/${packageId}/completed`);
//   }
 
//   hasAlreadyReviewed(userId: number, packageId: number) {
//     return this.http.get<boolean>(`${this.baseUrl}/exists/${userId}/${packageId}`);
//   }
// }
 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
 
private reviewBaseUrl = 'http://localhost:8084/api';
private bookingBaseUrl = 'http://localhost:8086/api/bookings';
 
  constructor(private http: HttpClient) { }
 
  // ✅ Get all reviews for a package
  getReviewsByPackageId(packageId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.reviewBaseUrl}/reviews/${packageId}`);
  }
 
  // ✅ Post a new review
  postReview(review: any): Observable<any> {
return this.http.post(`${this.reviewBaseUrl}/reviews`, review);
  }
 
  // ✅ Check if user completed booking for the package (matches your exact endpoint)
  hasCompletedBooking(userId: number, packageId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.bookingBaseUrl}/user/${userId}/package/${packageId}/completed`);
  }
 
  // ✅ Get agent responses for a review
  getAgentResponses(reviewId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.reviewBaseUrl}/agent-responses/${reviewId}`);
  }
 
  // ✅ Post agent response
  postAgentResponse(agentId: number, reviewId: number, response: any): Observable<any> {
return this.http.post(`${this.reviewBaseUrl}/agent-responses/${agentId}/${reviewId}`, response);
  }
 
  // ✅ Update agent response
  updateAgentResponse(responseId: number, response: any): Observable<any> {
    return this.http.put(`${this.reviewBaseUrl}/agent-responses/${responseId}`, response);
  }
 
  // ✅ Delete agent response
  deleteAgentResponse(responseId: number): Observable<any> {
    return this.http.delete(`${this.reviewBaseUrl}/agent-responses/${responseId}`);
  }
}