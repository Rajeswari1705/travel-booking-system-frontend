// import { Component, OnInit } from '@angular/core';
//  import { ActivatedRoute, Router } from '@angular/router';
//  import { TravelPackageService } from '../services/package.service';
// import { TravelPackage } from '../models/travel-package';
//  import { CommonModule } from '@angular/common';
//  import { ReviewService } from '../services/review.service';
// import { InsuranceService} from '../services/insurance.service';

// @Component({ selector: 'app-package-details',
//   standalone: true,
//    imports: [CommonModule],
//     templateUrl: './package-details.component.html',
//     styleUrl: './package-details.component.css' })
//   export class PackageDetailsComponent implements OnInit {
//      packageId!: number;
//     // travelPackage!: TravelPackage;
//    packageDetails:any;
// constructor( private route: ActivatedRoute,
//    private packageService: TravelPackageService,
//    private reviewService: ReviewService,
//    private insuranceService:InsuranceService,
//    private router: Router ) {}
 
//    ngOnInit(): void {
//     // Convert packageId from route snapshot (string) to number
//     const idParam = this.route.snapshot.paramMap.get('packageId');
//     if (idParam) {
//         this.packageId = Number(idParam);
//         console.log('Opened Package ID:', this.packageId);
 
//         this.packageService.getPackageById(this.packageId).subscribe({
//             next: (response: any) => {
//                 console.log('Fetched package details:', response);
//                 // Corrected assignment: handle both direct object and 'data' wrapper
//                 this.packageDetails = response.data || response;
//                 if (this.packageDetails && this.packageDetails.imageUrl && !this.packageDetails.imageUrls) {
//                   this.packageDetails.imageUrls = [this.packageDetails.imageUrl];
//                 }
//               },
//             error: (err) => {
//                 console.error('Failed to fetch package details', err);
//                 this.packageDetails = undefined; // Clear details on error
//             }
//         });
//     } else {
//         console.error('Package ID not found in route parameters.');
//         this.packageDetails = undefined;
//         // Optionally, navigate away or show an error message
//         this.router.navigate(['/customer-dashboard']);
//     }
//   }
 
//     // Ensure these methods pass a number for packageId
//   goToReview(): void {
//     if (this.packageId) {
//       this.router.navigate(['/review-dashboard', this.packageId]);
//     }
//   }
//   goToBooking(): void {
//     if (this.packageDetails) {
//       this.router.navigate(['/booking'], {
//         state: {
//           packageData: {
//             packageId: this.packageDetails.packageId,
//             tripStartDate: this.packageDetails.tripStartDate,
//             tripEndDate: this.packageDetails.tripEndDate
//           }
//         }
//       });
//     }
//   }
//   addInsurance(): void {
//     this.router.navigate(['/insurance-selection']);
//   }
   
//   }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TravelPackageService } from '../services/package.service';
// Assuming TravelPackage is defined in '../models/travel-package.ts'.
// If you have a separate file for this, ensure it's up-to-date with the properties below.
// For now, I'm defining a comprehensive interface directly here.
// import { TravelPackage } from '../models/travel-package'; // Uncomment if using an external model file

import { CommonModule } from '@angular/common'; // Essential for Angular directives like ngIf, ngFor, and pipes
import { ReviewService } from '../services/review.service';
import { InsuranceService } from '../services/insurance.service';

// Define a comprehensive TravelPackage interface.
// This ensures type safety and helps catch errors during development.
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
  tripEndDate: Date | string;   // Can be Date object or ISO string from API
  imageUrl?: string; // Optional: If the API provides a single main image URL
  imageUrls?: string[]; // Optional: Array of image paths for a gallery

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
  }>;
  sightseeing?: Array<{
    location: string;
    description: string;
  }>;
  itinerary?: Array<{ // Correctly typed as an array of objects
    dayNumber: number;
    activityTitle: string;
    activityDescription: string;
  }>;
  offer?: {
    couponCode: string;
    description: string;
    discountPercentage: number;
  };
}


@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css'
})
export class PackageDetailsComponent implements OnInit {
  packageId!: number;
  packageDetails: TravelPackage | undefined; // Use our comprehensive TravelPackage interface
  dynamicDefaultImage: string = ''; // New: Property to store the selected default image filename

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // private packageService: TravelPackageService,
    private reviewService: ReviewService,
    private insuranceService: InsuranceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('packageId');
    if (idParam) {
      this.packageId = Number(idParam);
      console.log('Opened Package ID:', this.packageId);
      
      //direct calling 
      const url = `http://localhost:8080/api/packages/${this.packageId}`;

      this.http.get<any>(url).subscribe({
        next: (response: any) => {
          console.log('Fetched package details:', response);
          // Assign fetched data, handling potential 'data' wrapper
          this.packageDetails = (response.data || response) as TravelPackage;

          if (this.packageDetails) {
            // Convert date strings to Date objects if necessary for date pipe
            if (typeof this.packageDetails.tripStartDate === 'string') {
              this.packageDetails.tripStartDate = new Date(this.packageDetails.tripStartDate);
            }
            if (typeof this.packageDetails.tripEndDate === 'string') {
              this.packageDetails.tripEndDate = new Date(this.packageDetails.tripEndDate);
            }

            // Logic to handle imageUrl or ensure imageUrls is an array
            if (this.packageDetails.imageUrl && (!this.packageDetails.imageUrls || this.packageDetails.imageUrls.length === 0)) {
              this.packageDetails.imageUrls = [this.packageDetails.imageUrl];
            } else if (!this.packageDetails.imageUrls) {
              // If no image data is present at all, initialize imageUrls as an empty array
              this.packageDetails.imageUrls = [];
            }

            // Call the dynamic default image setter if imageUrls is still empty
            if (this.packageDetails.imageUrls.length === 0) {
              this.setDynamicDefaultImage();
            }
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
   * Randomly selects one of 15 default images and sets its filename.
   * Assumes images are named 'image1.jpg', 'image2.jpg', ..., 'image15.jpg'
   * and are located in `src/assets/images/`.
   */
  setDynamicDefaultImage(): void {
    const totalImages = 15;
    const randomIndex = Math.floor(Math.random() * totalImages) + 1; // Generates a random number from 1 to 15
    this.dynamicDefaultImage = `images${randomIndex}.jpg`;
    console.log('Dynamic default image chosen:', this.dynamicDefaultImage);
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