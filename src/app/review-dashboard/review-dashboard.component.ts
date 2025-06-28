// // review-dashboard.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// // Define the structure for a Review as expected from your backend
// interface Review {
//   reviewId?: number;
//   userId: number;
//   packageId: number;
//   rating: number;
//   comment: string;
//   timestamp?: string; // ISO string date
//   agentResponse?: { // Optional agent response
//     responseMessage: string;
//     responseTime: string; // ISO string date
//   };
// }

// @Component({
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   selector: 'app-review-dashboard',
//   templateUrl: './review-dashboard.component.html',
//   styleUrl: './review-dashboard.component.css' // <-- This line now points to the separate CSS file
// })
// export class ReviewDashboardComponent implements OnInit {
//   packageId!: number;
//   userId: number = Number(sessionStorage.getItem('userId')) || 0; 
  
//   reviews: Review[] = [];
  
//   canReview: boolean = false;
//   hasReviewed: boolean = false;
  
//   newReview: { rating: number; comment: string } = { rating: 0, comment: '' };

//   editingReviewId: number | null = null;

//   private readonly REVIEWS_API_BASE_URL = 'http://localhost:8084/api/reviews';
//   private readonly BOOKINGS_API_BASE_URL = 'http://localhost:8082/api/bookings';

//   constructor(private route: ActivatedRoute, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));

//     if (this.userId === 0) {
//       console.warn('User ID not found in session storage. Please log in.');
//       return; 
//     }

//     this.loadReviews();
//     this.checkUserEligibility();
//   }

//   loadReviews(): void {
//     this.http.get<Review[]>(`${this.REVIEWS_API_BASE_URL}/${this.packageId}`)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           console.error(`Error loading reviews for package ${this.packageId}:`, error);
//           return of([]); 
//         })
//       )
//       .subscribe(data => {
//         this.reviews = data;
//         console.log('Reviews loaded:', this.reviews);
//       });
//   }

//   checkUserEligibility(): void {
//     this.http.get<boolean>(`${this.BOOKINGS_API_BASE_URL}/user/${this.userId}/package/${this.packageId}/completed`)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           console.error('Error checking booking completion:', error);
//           return of(false);
//         })
//       )
//       .subscribe(hasCompleted => {
//         this.canReview = hasCompleted;
//         if (hasCompleted) {
//           this.http.get<boolean>(`${this.REVIEWS_API_BASE_URL}/exists/${this.userId}/${this.packageId}`)
//             .pipe(
//               catchError((error: HttpErrorResponse) => {
//                 console.error('Error checking if user already reviewed:', error);
//                 return of(false);
//               })
//             )
//             .subscribe(alreadyReviewed => {
//               this.hasReviewed = alreadyReviewed;
//               console.log(`User ${this.userId} completed booking: ${this.canReview}, already reviewed: ${this.hasReviewed}`);
//             });
//         } else {
//           console.log(`User ${this.userId} has NOT completed booking for package ${this.packageId}`);
//         }
//       });
//   }

//   submitReview(): void {
//     if (this.newReview.rating < 1 || this.newReview.rating > 5) {
//       console.error('Rating must be between 1 and 5.');
//       return;
//     }
//     if (!this.newReview.comment.trim()) {
//       console.error('Comment cannot be empty.');
//       return;
//     }

//     const reviewData: Review = {
//       userId: this.userId,
//       packageId: this.packageId,
//       rating: this.newReview.rating,
//       comment: this.newReview.comment
//     };

//     this.http.post<Review>(this.REVIEWS_API_BASE_URL, reviewData)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           console.error('Error submitting review:', error);
//           alert(`Failed to submit review: ${error.error.message || error.message}`);
//           return of(null);
//         })
//       )
//       .subscribe(response => {
//         if (response) {
//           console.log('Review submitted successfully:', response);
//           this.loadReviews();
//           this.checkUserEligibility();
//           this.resetReviewForm();
//         }
//       });
//   }

//   enableEdit(review: Review): void {
//     this.editingReviewId = review.reviewId!;
//     this.newReview = {
//       rating: review.rating,
//       comment: review.comment
//     };
//   }

//   updateReview(): void {
//     if (this.editingReviewId !== null) {
//       const updatedReviewData: Review = {
//         userId: this.userId,
//         packageId: this.packageId,
//         rating: this.newReview.rating,
//         comment: this.newReview.comment
//       };

//       this.http.put<Review>(`${this.REVIEWS_API_BASE_URL}/${this.editingReviewId}`, updatedReviewData)
//         .pipe(
//           catchError((error: HttpErrorResponse) => {
//             console.error('Error updating review:', error);
//             alert(`Failed to update review: ${error.error.message || error.message}`);
//             return of(null);
//           })
//         )
//         .subscribe(response => {
//           if (response) {
//             console.log('Review updated successfully:', response);
//             this.loadReviews();
//             this.cancelEdit();
//           }
//         });
//     }
//   }

//   deleteReview(reviewId: number): void {
//     this.http.delete(`${this.REVIEWS_API_BASE_URL}/${reviewId}`)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           console.error('Error deleting review:', error);
//           alert(`Failed to delete review: ${error.error.message || error.message}`);
//           return of(null);
//         })
//       )
//       .subscribe(response => {
//         if (response) {
//           console.log('Review deleted successfully.');
//           this.loadReviews();
//           this.checkUserEligibility();
//         }
//       });
//   }

//   cancelEdit(): void {
//     this.editingReviewId = null;
//     this.resetReviewForm();
//   }

//   private resetReviewForm(): void {
//     this.newReview = {
//       rating: 0,
//       comment: ''
//     };
//   }
// }













// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
 
// @Component({
//   selector: 'app-review-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './review-dashboard.component.html'
// })
// export class ReviewDashboardComponent implements OnInit {
//   packageId!: number;
//   userId!: number;
//   completedBooking = false;
//   alreadyReviewed = false;
//   rating = 0;
//   comment = '';
//   reviews: any[] = [];
//   message = '';
 
//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient
//   ) {}
 
//   ngOnInit(): void {
//     this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));
//     this.userId = Number(localStorage.getItem('userId')); // store user id at login
//     this.checkCompletedBooking();
//     this.loadReviews();
//   }
 
//   checkCompletedBooking() {
// this.http.get<boolean>(`http://localhost:8086/api/bookings/user/${this.userId}/package/${this.packageId}/completed`)
//       .subscribe({
//         next: (res) => {
//           this.completedBooking = res;
//           if (!this.completedBooking) {
//             this.message = "You can only review this package after completing the trip.";
//           }
//         },
//         error: () => this.message = "Could not validate booking. Try again later."
//       });
//   }
 
//   loadReviews() {
// this.http.get(`http://localhost:8084/api/reviews/${this.packageId}`)
//       .subscribe({
//         next: (res) => {
// this.reviews = res;
// this.alreadyReviewed = this.reviews.some(r => r.userId === this.userId);
//           if (this.alreadyReviewed) {
//             this.message = "You have already reviewed this package.";
//           }
//         },
//         error: () => this.message = "Failed to load reviews."
//       });
//   }
 
//   submitReview() {
//     if (this.comment.length < 10) {
//       this.message = "Comment must be at least 10 characters.";
//       return;
//     }
 
//     const review = {
//       userId: this.userId,
//       packageId: this.packageId,
//       rating: this.rating,
//       comment: this.comment
//     };
 
// this.http.post('http://localhost:8084/api/reviews', review)
//       .subscribe({
//         next: () => {
//           this.message = "Review submitted successfully.";
//           this.loadReviews(); // reload to show
//         },
//         error: () => this.message = "Failed to submit review."
//       });
//   }
 
//   setRating(stars: number) {
//     this.rating = stars;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-review-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-dashboard.component.html'
})
export class ReviewDashboardComponent implements OnInit {
  packageId!: number;
  userId!: number;
  completedBooking = false;
  alreadyReviewed = false;
  rating = 0;
  comment = '';
  reviews: any[] = [];
  message = '';
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
 
  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));
    this.userId = Number(localStorage.getItem('userId'));
    this.checkCompletedBooking();
    this.loadReviews();
  }
 
  checkCompletedBooking() {
    this.http.get<boolean>(`http://localhost:8086/api/bookings/user/${this.userId}/package/${this.packageId}/completed`)
      .subscribe({
        next: (res) => {
          this.completedBooking = res;
          if (!this.completedBooking) {
            this.message = "You can only review this package after completing the trip.";
          }
        },
        error: () => this.message = "Could not validate booking. Try again later."
      });
  }
 
  loadReviews() {
    this.http.get<any[]>(`http://localhost:8084/api/reviews/${this.packageId}`)
      .subscribe({
        next: (res) => {
          this.reviews = res;
          this.alreadyReviewed = this.reviews.some(r => r.userId === this.userId);
          if (this.alreadyReviewed) {
            this.message = "You have already reviewed this package.";
          }
        },
        error: () => this.message = "Failed to load reviews."
      });
  }
 
  submitReview() {
    if (this.comment.length < 10) {
      this.message = "Comment must be at least 10 characters.";
      return;
    }
 
    const review = {
      userId: this.userId,
      packageId: this.packageId,
      rating: this.rating,
      comment: this.comment
    };
 
    this.http.post('http://localhost:8084/api/reviews', review)
      .subscribe({
        next: () => {
          this.message = "Review submitted successfully.";
          this.loadReviews();
          this.rating = 0;
          this.comment = '';
        },
        error: () => this.message = "Failed to submit review."
      });
  }
 
  setRating(stars: number) {
    this.rating = stars;
  }
}
 