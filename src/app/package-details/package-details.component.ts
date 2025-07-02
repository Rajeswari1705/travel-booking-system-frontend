import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelPackageService } from '../services/package.service';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../services/review.service';
import { InsuranceService } from '../services/insurance.service';

// Define a comprehensive TravelPackage interface.
export interface TravelPackage {
  packageId: number;
  title: string;
  description: string;
  destination: string;
  country: string;
  tripType: string;
  duration: number;
  price: number;
  maxCapacity: number;
  tripStartDate: Date | string; // Can be Date object or ISO string from API
  tripEndDate: Date | string;   // Can be Date object or ISO string from API
  imageUrl?: string; // Optional: If the API provides a single main image URL (expected to be a filename or full URL)
  imageUrls?: string[]; // Optional: Array of image paths for a gallery (expected to be filenames or full URLs)

  // Optional sections based on your HTML template
  highlights?: string[];
  flights?: Array<{
    airline: string;
    fromCity: string;
    toCity: string;
    departureTime: string;
    arrivalTime: string;
  }>;
  hotels?: Array<{
    name: string;
    city: string;
    rating: number;
    nights: number;
    costPerNight?: number;
  }>;
  sightseeing?: Array<{
    location: string;
    description: string;
  }>;
  itinerary?: Array<{
    dayNumber: number;
    activityTitle: string;
    activityDescription: string;
  }>;
  offer?: {
    couponCode: string;
    description: string;
    discountPercentage: number;
    active?: boolean;
  };
}


@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})
export class PackageDetailsComponent implements OnInit {
  packageId!: number;
  packageDetails: TravelPackage | undefined;
  dynamicDefaultImage: string = ''; // Property to store the selected default image filename (e.g., 'image_8116da.png')

  constructor(
    private route: ActivatedRoute,
    private packageService: TravelPackageService,
    private reviewService: ReviewService,
    private insuranceService: InsuranceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('packageId');
    if (idParam) {
      this.packageId = Number(idParam);
      console.log('Opened Package ID:', this.packageId);

      this.packageService.getPackageById(this.packageId).subscribe({
        next: (response: any) => {
          console.log('Fetched package details:', response);
          this.packageDetails = (response.data || response) as TravelPackage;

          if (this.packageDetails) {
            // Convert date strings to Date objects if necessary for date pipe
            if (typeof this.packageDetails.tripStartDate === 'string') {
              this.packageDetails.tripStartDate = new Date(this.packageDetails.tripStartDate);
            }
            if (typeof this.packageDetails.tripEndDate === 'string') {
              this.packageDetails.tripEndDate = new Date(this.packageDetails.tripEndDate);
            }

            // --- IMPORTANT IMAGE HANDLING LOGIC ---
            const finalImageUrls: string[] = [];

            // 1. Process single 'imageUrl' from API
            if (this.packageDetails.imageUrl) {
              const processedUrl = this.buildFullImagePath(this.packageDetails.imageUrl);
              finalImageUrls.push(processedUrl);
            }

            // 2. Process 'imageUrls' array from API
            if (this.packageDetails.imageUrls && this.packageDetails.imageUrls.length > 0) {
              this.packageDetails.imageUrls.forEach(url => {
                const processedUrl = this.buildFullImagePath(url);
                // Avoid adding duplicates (e.g., if imageUrl was already added from main imageUrl)
                if (!finalImageUrls.includes(processedUrl)) {
                  finalImageUrls.push(processedUrl);
                }
              });
            }

            // 3. Fallback to dynamic default image if no images were found at all
            if (finalImageUrls.length === 0) {
              this.setDynamicDefaultImage(); // Sets this.dynamicDefaultImage (e.g., 'image_8116da.png')
              // Build full path for the chosen dynamic default image
              finalImageUrls.push(this.buildFullImagePath(this.dynamicDefaultImage));
            }

            // Assign the constructed array back to packageDetails.imageUrls
            this.packageDetails.imageUrls = finalImageUrls;
            // --- END IMAGE HANDLING LOGIC ---

          }
        },
        error: (err) => {
          console.error('Failed to fetch package details', err);
          this.packageDetails = undefined; // Clear details on error
          this.router.navigate(['/customer-dashboard']); // Redirect on error
        }
      });
    } else {
      console.error('Package ID not found in route parameters.');
      this.packageDetails = undefined;
      this.router.navigate(['/customer-dashboard']); // Redirect if ID is missing
    }
  }

  /**
   * Randomly selects one of the provided default image filenames.
   * This method only sets the filename, not the full path.
   * Assumes these images are located in `src/assets/images/`.
   */
  setDynamicDefaultImage(): void {
    const defaultImageFilenames = [
      'image_8116da.png', // Provided image 1
      'image_772dd1.png'  // Provided image 2
      // Add more filenames here if you have other default images in assets/images/
    ];
    const randomIndex = Math.floor(Math.random() * defaultImageFilenames.length);
    this.dynamicDefaultImage = defaultImageFilenames[randomIndex];
    console.log('Dynamic default image chosen:', this.dynamicDefaultImage);
  }

  /**
   * Helper function to build the full image path.
   * Handles absolute URLs, paths already including 'assets/images/',
   * or just filenames by prepending 'assets/images/'.
   */
  private buildFullImagePath(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // It's an absolute URL, use as is
    }
    // Ensure it has the 'assets/images/' prefix
    if (!url.startsWith('assets/images/')) {
        // If it starts with 'assets/' but not 'assets/images/', correct it
        if (url.startsWith('assets/')) {
            return url.replace('assets/', 'assets/images/');
        }
        // Otherwise, assume it's just a filename and prepend 'assets/images/'
        return 'assets/images/' + url;
    }
    return url; // Already correctly prefixed with 'assets/images/'
  }

  goToReview(): void {
    if (this.packageId) {
      this.router.navigate(['/review-dashboard', this.packageId]);
    }
  }

  goToBooking(): void {
    if (this.packageDetails) {
      this.router.navigate(['/booking'], {
        state: {
          packageData: {
            packageId: this.packageDetails.packageId,
            tripStartDate: this.packageDetails.tripStartDate,
            tripEndDate: this.packageDetails.tripEndDate
          }
        }
      });
    }
  }

  addInsurance(): void {
    this.router.navigate(['/insurance-selection']);
  }
}