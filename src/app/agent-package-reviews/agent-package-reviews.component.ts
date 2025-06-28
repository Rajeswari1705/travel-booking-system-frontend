import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-agent-package-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-package-reviews.component.html'
})
export class AgentPackageReviewsComponent implements OnInit {
  packageId!: number;
  agentId!: number;
  reviews: any[] = [];
  newResponse: Record<number, string> = {};
  message = '';
 
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
 
  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));
    this.agentId = Number(localStorage.getItem('userId'));
    this.loadReviews();
  }
 
  loadReviews() {
    this.http.get<any>(`http://localhost:8084/api/reviews/${this.packageId}`)
      .subscribe({
        next: (res) => {
          this.reviews = Array.isArray(res) ? res :res.data || [];
          this.loadAgentResponses();
        },
        error: () => this.message = "Failed to load reviews."
      });
  }
 
  loadAgentResponses() {
  for (let review of this.reviews) {
      this.http.get(`http://localhost:8084/api/agent-responses/${review.reviewId}`)
        .subscribe({
          next: (responses) => review.agentResponses = responses
        });
    }
  }
 
  submitResponse(reviewId: number) {
    // secure: only package owner can respond
    this.http.get<any>(`http://localhost:8080/api/packages/${this.packageId}`)
      .subscribe({
        next: (pkg) => {
          if (pkg.
            agentId !== this.agentId) {
            this.message = "You are not allowed to respond to this package's reviews.";
            return;
          }
          const payload = { responseMessage: this.newResponse[reviewId] };
            this.http.post(`http://localhost:8084/api/agent-responses/${this.agentId}/${reviewId}`, payload)
            .subscribe({
              next: () => {
                this.message = "Response posted.";
                this.newResponse[reviewId] = '';
                this.loadReviews();
              },
              error: () => this.message = "Failed to post response."
            });
        },
        error: () => this.message = "Failed to verify package ownership."
      });
  }
}