// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
 
// @Component({
//   selector: 'app-agent-package-reviews',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './agent-package-reviews.component.html'
// })
// export class AgentPackageReviewsComponent implements OnInit {
//   packageId!: number;
//   agentId!: number;
//   reviews: any[] = [];
//   newResponse: Record<number, string> = {};
//   message = '';
 
//   constructor(private route: ActivatedRoute, private http: HttpClient) {}
 
//   ngOnInit(): void {
//     this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));
//     this.agentId = Number(localStorage.getItem('userId'));
//     this.loadReviews();
//   }
 
//   loadReviews() {
//     this.http.get<any>(`http://localhost:8084/api/reviews/${this.packageId}`)
//       .subscribe({
//         next: (res) => {
//           this.reviews = Array.isArray(res) ? res :res.data || [];
//           this.loadAgentResponses();
//         },
//         error: () => this.message = "Failed to load reviews."
//       });
//   }
 
//   loadAgentResponses() {
//   for (let review of this.reviews) {
//       this.http.get(`http://localhost:8084/api/agent-responses/${review.reviewId}`)
//         .subscribe({
//           next: (responses) => review.agentResponses = responses
//         });
//     }
//   }
 
//   submitResponse(reviewId: number) {
//     // secure: only package owner can respond
//     this.http.get<any>(`http://localhost:8080/api/packages/${this.packageId}`)
//       .subscribe({
//         next: (pkg) => {
//           if (pkg.
//             agentId !== this.agentId) {
//             this.message = "You are not allowed to respond to this package's reviews.";
//             return;
//           }
//           const payload = { responseMessage: this.newResponse[reviewId] };
//             this.http.post(`http://localhost:8084/api/agent-responses/${this.agentId}/${reviewId}`, payload)
//             .subscribe({
//               next: () => {
//                 this.message = "Response posted.";
//                 this.newResponse[reviewId] = '';
//                 this.loadReviews();
//               },
//               error: () => this.message = "Failed to post response."
//             });
//         },
//         error: () => this.message = "Failed to verify package ownership."
//       });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Keep HttpClientModule here
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf, *ngFor, date pipe
import { FormsModule } from '@angular/forms'; // Import FormsModule for [(ngModel)]

// Import your Review and AgentResponse models
import { Review } from '../models/review.model'; // Correct relative path
import { AgentResponse } from '../models/agent-response.model'; // Correct relative path

// Import the DashboardNavbarComponent directly as it should be standalone
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component'; // Adjust path if necessary

@Component({
  selector: 'app-agent-package-reviews',
  templateUrl: './agent-package-reviews.component.html',
  styleUrls: ['./agent-package-reviews.component.css'],
  standalone: true, // This component is declared as standalone
  imports: [
    CommonModule, // Provides *ngIf, *ngFor, date pipe
    FormsModule,  // Provides [(ngModel)]
    HttpClientModule, // Provides HttpClient (typically imported in AppModule too, but good to have here)
    DashboardNavbarComponent // Your custom navbar component
  ]
})
export class AgentPackageReviewsComponent implements OnInit {
  packageId!: number;
  reviews: Review[] = [];
  message: string = '';
  agentId: number | null = null;
  newResponse: { [reviewId: number]: string } = {}; // To hold new response text for each review

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Get agentId from localStorage. Use `null` as default if not found to avoid issues.
    const storedUserId = localStorage.getItem('userId');
    this.agentId = storedUserId ? Number(storedUserId) : null;

    this.route.paramMap.subscribe(params => {
      const id = params.get('packageId');
      if (id) {
        this.packageId = +id; // Convert string to number
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
      .subscribe({
        next: (data) => {
          this.reviews = data;
          console.log('Reviews fetched:', this.reviews);

          // For each review, fetch its agent response if it exists
          this.reviews.forEach(review => {
            if (review.reviewId !== undefined && review.reviewId !== null) { // Ensure reviewId exists before using
              this.newResponse[review.reviewId] = ''; // Initialize input field for each review

              this.http.get<AgentResponse[]>(`http://localhost:8084/api/agent-responses/${review.reviewId}`)
                .subscribe({
                  next: (responses) => {
                    // Assuming only one agent response per review for simplicity, take the first one
                    if (responses && responses.length > 0) {
                      review.agentResponse = responses[0]; // Attach agent response object to the review
                    } else {
                      review.agentResponse = null; // Explicitly set to null if no response
                    }
                  },
                  error: (err) => {
                    console.error(`Error fetching agent response for review ${review.reviewId}:`, err);
                    review.agentResponse = null; // Set to null on error
                  }
                });
            } else {
                console.warn('Review object encountered without a valid reviewId:', review);
            }
          });
        },
        error: (err) => {
          this.message = 'Failed to load reviews.';
          console.error('Error loading reviews:', err);
        }
      });
  }

  

// src/app/agent-package-reviews/agent-package-reviews.component.ts

// ... (other code)

submitResponse(reviewId: number): void {
  console.log('Logged-in Agent ID (this.agentId):', this.agentId);
  console.log('Attempting to respond to reviewId:', reviewId, 'for packageId:', this.packageId);

  if (this.agentId === null) {
    this.message = "Agent ID not available. Please log in again.";
    console.error('Agent ID is null, cannot submit response.');
    return;
  }

  this.http.get<any>(`http://localhost:8080/api/packages/${this.packageId}`)
    .subscribe({
      next: (pkg) => {
        // CORRECTED LINE: Access agentId from the 'data' property
        console.log('Package Owner Agent ID (pkg.data.agentId) from backend for packageId', this.packageId, ':', pkg.data.agentId);

        if (pkg.data.agentId !== this.agentId) { // <-- THIS IS THE FIX
          this.message = "You are not allowed to respond to this package's reviews.";
          console.warn('Authorization failed: pkg.data.agentId (', pkg.data.agentId, ') !== this.agentId (', this.agentId, ')');
          return;
        }

        const responseText = this.newResponse[reviewId];
        if (!responseText || responseText.trim() === '') {
          this.message = 'Response message cannot be empty.';
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
}