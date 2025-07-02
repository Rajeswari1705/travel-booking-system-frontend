import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-review-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-dashboard.component.html', // This will point to the updated HTML
  styleUrls: ['./review-dashboard.component.css']
})
export class ReviewDashboardComponent implements OnInit {
  packageId!: number;
  userId!: number; // This will hold the ID of the logged-in user
  completedBooking = false;
  alreadyReviewed = false;
  rating = 0; // For new review submission
  comment = ''; // For new review submission
  reviews: any[] = [];
  message = '';
  editingReview: any = null; // Holds the review object being edited

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));

    // Safely get userId from localStorage, convert to number, default to 0
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? Number(storedUserId) : 0;

    // If userId is 0, it means the user is not logged in or userId is not in localStorage
    if (!this.userId || this.userId === 0) {
        this.message = "Please log in to view and leave reviews.";
        console.warn("User ID not found in localStorage or is 0. Cannot proceed with review actions.");
        return; // Stop further execution if user is not logged in
    }

    // Proceed only if userId is valid
    this.checkCompletedBooking();
    this.loadReviews();
  }

  checkCompletedBooking() {
    this.http.get<boolean>(`http://localhost:8086/api/bookings/user/${this.userId}/package/${this.packageId}/completed`)
      .subscribe({
        next: (res) => {
          this.completedBooking = res;
          // Set message if not completed, otherwise clear it to allow form to show
          if (!this.completedBooking) {
            this.message = "You can only review this package after completing the trip.";
          } else {
            // Clear message if booking is completed, unless alreadyReviewed message needs to be shown
            if (!this.alreadyReviewed) { // Only clear if not already reviewed
              this.message = "";
            }
          }
        },
        error: () => {
          this.message = "Could not validate booking status. Try again later.";
          this.completedBooking = false; // Assume not completed on error
        }
      });
  }

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

          // Update message based on current state after loading reviews
          if (this.completedBooking && this.alreadyReviewed) {
              this.message = "You have already reviewed this package. You can edit your existing review below.";
          } else if (this.completedBooking && !this.alreadyReviewed) {
              this.message = ""; // Clear message if completed and not yet reviewed, so the form can show
          } else if (!this.completedBooking) {
              this.message = "You can only review this package after completing the trip.";
          }
          // If no specific message applies, it remains empty, which is good for the form to appear.

          // If the user has already reviewed and is not currently editing,
          // ensure the form for new review is hidden and edit option is available.
          // No need to pre-fill the form here, as startEditReview will do that.
        },
        error: () => {
          this.message = "Failed to load reviews or agent responses.";
          console.error("Error in loadReviews subscription.");
          this.alreadyReviewed = false; // Assume no reviews if loading fails
        }
      });
  }

  submitReview() {
    if (this.rating === 0) {
      this.message = "Please provide a rating.";
      return;
    }
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
          this.rating = 0; // Reset form fields
          this.comment = ''; // Reset form fields
        },
        error: (err) => {
          if (err.status === 400 && err.error && err.error.message && err.error.message.includes("already reviewed")) {
            this.message = "You have already submitted a review for this package.";
          } else {
            this.message = "Failed to submit review. Please check console for details.";
          }
          console.error("Error submitting review:", err);
        }
      });
  }

  setRating(stars: number) {
    this.rating = stars; // Update rating for new review form
  }

  // Method to start editing a review
  startEditReview(review: any) {
      this.editingReview = { ...review }; // Create a copy of the review to edit
      this.rating = this.editingReview.rating; // Populate rating input with existing rating
      this.comment = this.editingReview.comment; // Populate comment input with existing comment
      this.message = ''; // Clear any previous messages
  }

  // Method to set rating for the review being edited
  setEditRating(stars: number) {
    this.rating = stars; // Update the main rating variable for the edit form
    if (this.editingReview) {
      this.editingReview.rating = stars; // Also update the editingReview object's rating
    }
  }

  // Method to submit the edited review
  submitEditReview() {
    if (!this.editingReview || !this.editingReview.reviewId) {
      this.message = "No review selected for editing.";
      return;
    }

    // Use this.comment and this.rating for the submission, as they are bound to the edit form
    if (this.comment.length < 10) {
      this.message = "Edited comment must be at least 10 characters.";
      return;
    }

    const updatedReview = {
        reviewId: this.editingReview.reviewId,
        userId: this.userId, // Ensure userId is the logged-in user's ID
        packageId: this.packageId,
        rating: this.rating, // Use the current rating from the edit form
        comment: this.comment // Use the current comment from the edit form
    };

    this.http.put(`http://localhost:8084/api/reviews/${updatedReview.reviewId}`, updatedReview)
      .subscribe({
        next: () => {
          this.message = "Review updated successfully.";
          this.editingReview = null; // Exit edit mode
          this.rating = 0; // Reset form fields
          this.comment = ''; // Reset form fields
          this.loadReviews(); // Reload reviews to show updated one
        },
        error: (err) => {
          this.message = "Failed to update review.";
          console.error("Error updating review:", err);
        }
      });
  }

  // Method to cancel editing
  cancelEdit() {
    this.editingReview = null; // Exit edit mode without saving
    this.rating = 0; // Reset form fields
    this.comment = ''; // Reset form fields
    this.message = ''; // Clear any messages
  }

  // Method to delete a review
  deleteReview(reviewId: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.http.delete(`http://localhost:8084/api/reviews/${reviewId}`)
        .subscribe({
          next: () => {
            this.message = "Review deleted successfully.";
            this.loadReviews(); // Reload reviews after deletion
            this.checkCompletedBooking(); // Re-check booking status as review count might change eligibility
          },
          error: (err) => {
            this.message = "Failed to delete review.";
            console.error("Error deleting review:", err);
          }
        });
    }
  }

  goBackToPackage() {
    this.router.navigate(['/packages', this.packageId]);
  }
}