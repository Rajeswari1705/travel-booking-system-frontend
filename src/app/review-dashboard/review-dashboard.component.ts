// review-dashboard.component.ts
// =============================
import { FormsModule } from '@angular/forms';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { Review } from '../models/review.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-review-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './review-dashboard.component.html',
  styleUrl: './review-dashboard.component.css'
})

export class ReviewDashboardComponent implements OnInit {
  packageId!: number;
  userId: number = Number(sessionStorage.getItem('userId'));
  newReview={
    rating:0,
    comment:'',
    userId:0,
    packageId:0
   };
  reviews: any[] = [];
  editingReviewId: number | null = null;
  hasAlreadyReviewed: boolean = false;
  canReview: boolean = false;
 
  constructor(private route: ActivatedRoute, private reviewService: ReviewService) {}
 
  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('packageId'));
    this.loadReviews();
    this.checkUserEligibility();
  }
 
  loadReviews() {
    this.reviewService.getReviewsByPackage(this.packageId).subscribe(data => {
      this.reviews = data;
    });
  }
 
  checkUserEligibility() {
    this.reviewService.hasCompletedBooking(this.userId, this.packageId).subscribe(hasCompleted => {
      if (hasCompleted) {
        this.reviewService.hasAlreadyReviewed(this.userId, this.packageId).subscribe(already => {
          this.hasAlreadyReviewed = already;
          this.canReview = !already;
        });
      }
    });
  }
 
  submitReview() {
    this.reviewService.postReview({
      userId: this.userId,
      packageId: this.packageId,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    }).subscribe(() => {
      this.loadReviews();
      this.canReview = false;
      this.newReview = {
        rating: 0,
        comment: '',
        userId: this.userId,
        packageId: this.packageId
      };
      
    });
  }
 
  enableEdit(review: any) {
    this.editingReviewId = review.reviewId;
    this.newReview = {
      rating: review.rating,
      comment: review.comment,
      userId: this.userId,
      packageId: this.packageId
    };
     }
 
  updateReview() {
    if (this.editingReviewId != null) {
      this.reviewService.updateReview(this.editingReviewId, this.newReview).subscribe(() => {
        this.loadReviews();
        this.editingReviewId = null;
        this.newReview = {
          rating: 0,
          comment: '',
          userId: this.userId,
          packageId: this.packageId
        };
        });
    }
  }
 
  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.loadReviews();
      this.canReview = true;
    });
  }
 
  cancelEdit() {
    this.editingReviewId = null;
    this.newReview = {
      rating: 0,
      comment: '',
      userId: this.userId,
      packageId: this.packageId
    };
    }
}
 