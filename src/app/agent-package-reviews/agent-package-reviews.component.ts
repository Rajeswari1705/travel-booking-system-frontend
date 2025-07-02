import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Review } from '../models/review.model';
import { AgentResponse } from '../models/agent-response.model';

import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';

@Component({
  selector: 'app-agent-package-reviews',
  templateUrl: './agent-package-reviews.component.html',
  styleUrls: ['./agent-package-reviews.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DashboardNavbarComponent
  ]
})
export class AgentPackageReviewsComponent implements OnInit {
  packageId!: number;
  reviews: Review[] = [];
  message: string = '';
  agentId: number | null = null;
  newResponse: { [reviewId: number]: string } = {};

  editingAgentResponse: AgentResponse | null = null;
  originalEditResponseText: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.agentId = storedUserId ? Number(storedUserId) : null;

    this.route.paramMap.subscribe(params => {
      const id = params.get('packageId');
      if (id) {
        this.packageId = +id;
        this.loadReviews();
      } else {
        this.message = "Package ID not found in route.";
        console.error('Package ID is missing from route parameters.');
      }
    });
  }

  loadReviews(): void {
    console.log('loadReviews() called');
    this.http.get<Review[]>(`http://localhost:8084/api/reviews/${this.packageId}`)
      .pipe(
        switchMap(reviews => {
          if (reviews.length === 0) {
            return of([]);
          }

          const reviewObservables = reviews.map(review => {
            if (review.reviewId !== undefined && review.reviewId !== null) {
              this.newResponse[review.reviewId] = '';
              return this.http.get<AgentResponse[]>(`http://localhost:8084/api/agent-responses/${review.reviewId}`).pipe(
                map(responses => {
                  review.agentResponse = (responses && responses.length > 0) ? responses[0] : null;
                  return review;
                }),
                catchError(err => {
                  console.error(`Error fetching agent response for review ${review.reviewId}:`, err);
                  review.agentResponse = null;
                  return of(review);
                })
              );
            } else {
              console.warn('Review object encountered without a valid reviewId:', review);
              return of(review);
            }
          });
          return forkJoin(reviewObservables);
        })
      )
      .subscribe({
        next: (data) => {
          this.reviews = data;
          console.log('Reviews with agent responses fetched:', this.reviews);
        },
        error: (err) => {
          this.message = 'Failed to load reviews.';
          console.error('Error loading reviews:', err);
        }
      });
  }

  submitResponse(reviewId: number): void {
    console.log('Logged-in Agent ID (this.agentId):', this.agentId);
    console.log('Attempting to respond to reviewId:', reviewId, 'for packageId:', this.packageId);

    if (this.agentId === null) {
      this.message = "Agent ID not available. Please log in again.";
      console.error('Agent ID is null, cannot submit response.');
      return;
    }

    const responseText = this.newResponse[reviewId];
    if (!responseText || responseText.trim() === '') {
      this.message = 'Response message cannot be empty.';
      return;
    }

    this.http.get<any>(`http://localhost:8080/api/packages/${this.packageId}`)
      .subscribe({
        next: (pkg) => {
          if (!pkg || !pkg.data || pkg.data.agentId !== this.agentId) {
            this.message = "You are not allowed to respond to this package's reviews.";
            console.warn('Authorization failed: pkg.data.agentId (', pkg?.data?.agentId, ') !== this.agentId (', this.agentId, ')');
            return;
          }

          const payload = { responseMessage: responseText.trim() };
          this.http.post(`http://localhost:8084/api/agent-responses/${this.agentId}/${reviewId}`, payload)
            .subscribe({
              next: () => {
                this.message = "Response posted successfully.";
                this.newResponse[reviewId] = '';
                this.loadReviews();
              },
              error: (err) => {
                this.message = "Failed to post response.";
                console.error('Error posting response:', err);
              }
            });
        },
        error: (err) => {
          this.message = "Failed to verify package ownership.";
          console.error('Error verifying package ownership:', err);
        }
      });
  }

  startEditResponse(response: AgentResponse): void {
    if (response.agentId !== this.agentId) {
      this.message = "You can only edit your own responses.";
      return;
    }
    this.editingAgentResponse = { ...response };
    this.originalEditResponseText = response.responseMessage;
    this.message = '';
  }

  submitEditResponse(): void {
    if (!this.editingAgentResponse || this.editingAgentResponse.agentId !== this.agentId) {
      this.message = "Invalid response or not authorized to edit.";
      return;
    }

    if (!this.editingAgentResponse.responseMessage || this.editingAgentResponse.responseMessage.trim() === '') {
      this.message = "Response message cannot be empty.";
      return;
    }

    const updatedPayload = { responseMessage: this.editingAgentResponse.responseMessage.trim() };

    this.http.put(`http://localhost:8084/api/agent-responses/${this.editingAgentResponse.responseId}`, updatedPayload)
      .subscribe({
        next: () => {
          this.message = "Response updated successfully.";
          this.editingAgentResponse = null;
          this.originalEditResponseText = '';
          this.loadReviews();
        },
        error: (err) => {
          this.message = "Failed to update response.";
          console.error('Error updating response:', err);
        }
      });
  }

  cancelEditResponse(): void {
    if (this.editingAgentResponse) {
      const reviewToUpdate = this.reviews.find(r => r.reviewId === this.editingAgentResponse?.reviewId);
      if (reviewToUpdate && reviewToUpdate.agentResponse) {
        reviewToUpdate.agentResponse.responseMessage = this.originalEditResponseText;
      }
    }
    this.editingAgentResponse = null;
    this.originalEditResponseText = '';
    this.message = '';
  }

  deleteAgentResponse(responseId: number): void {
    const responseToDelete = this.reviews
      .map(r => r.agentResponse)
      .find(ar => ar?.responseId === responseId);

    if (!responseToDelete || responseToDelete.agentId !== this.agentId) {
      this.message = "You can only delete your own responses.";
      return;
    }

    if (confirm('Are you sure you want to delete this response?')) {
      this.http.delete(`http://localhost:8084/api/agent-responses/${responseId}`)
        .subscribe({
          next: () => {
            this.message = "Response deleted successfully.";
            this.loadReviews();
          },
          error: (err) => {
            this.message = "Failed to delete response.";
            console.error('Error deleting response:', err);
          }
        });
    }
  }
}