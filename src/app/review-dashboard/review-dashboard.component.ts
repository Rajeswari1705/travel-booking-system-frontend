import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs'; // NEW: Import 'of' and 'forkJoin'
import { catchError, map, switchMap } from 'rxjs/operators'; // NEW: Import RxJS operators

@Component({
  selector: 'app-review-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-dashboard.component.html',
  styleUrls: ['./review-dashboard.component.css']
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
    private router: Router,
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

  // CRITICAL: This method fetches reviews AND then fetches agent responses for each
  loadReviews() {
    this.http.get<any[]>(`http://localhost:8084/api/reviews/${this.packageId}`)
      .pipe(
        switchMap(reviews => {
          if (reviews.length === 0) {
            return of([]); // If no reviews, return an empty array directly
          }

          // For each review, make a separate API call to get its agent response
          const reviewWithAgentResponses$ = reviews.map(review =>
            this.http.get<any[]>(`http://localhost:8084/api/agent-responses/${review.reviewId}`).pipe(
              map(agentResponses => {
                // Assuming agent-responses/{reviewId} returns an array, take the first one if present
                // This line attaches the 'agentResponse' property to your 'review' object
                review.agentResponse = agentResponses.length > 0 ? agentResponses[0] : null;
                return review; // Return the modified review object
              }),
              catchError(error => {
                console.error(`Error fetching agent response for review ${review.reviewId}:`, error);
                review.agentResponse = null; // Set to null on error to prevent breaking display
                return of(review); // Continue with other reviews even if this one fails
              })
            )
          );
          // Use forkJoin to wait for all individual agent response fetches to complete
          return forkJoin(reviewWithAgentResponses$);
        })
      )
      .subscribe({
        next: (reviewsWithResponses) => {
          this.reviews = reviewsWithResponses; // Update the reviews array with agent responses
          this.alreadyReviewed = this.reviews.some(r => r.userId === this.userId);
          if (this.alreadyReviewed) {
            this.message = "You have already reviewed this package.";
          }
        },
        error: () => {
          this.message = "Failed to load reviews or agent responses.";
          console.error("Error in loadReviews subscription.");
        }
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
          this.loadReviews(); // Reload reviews to show the new one
          this.rating = 0;
          this.comment = '';
        },
        error: () => this.message = "Failed to submit review."
      });
  }

  setRating(stars: number) {
    this.rating = stars;
  }
  goBackToPackage() {
    this.router.navigate(['/packages', this.packageId]);
  }
}