import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router'; 
 import { TravelPackageService } from '../services/package.service';
import { TravelPackage } from '../models/travel-package';
 import { CommonModule } from '@angular/common';
 
@Component({ selector: 'app-package-details', 
  standalone: true,
   imports: [CommonModule],
    templateUrl: './package-details.component.html', 
    styleUrl: './package-details.component.css' }) 
  export class PackageDetailsComponent implements OnInit {
     packageId!: number;
    // travelPackage!: TravelPackage;
   packageDetails:any;
constructor( private route: ActivatedRoute,
   private packageService: TravelPackageService, 
   private router: Router ) {}
 
   ngOnInit(): void {
    // Convert packageId from route snapshot (string) to number
    const idParam = this.route.snapshot.paramMap.get('packageId');
    if (idParam) {
        this.packageId = Number(idParam);
        console.log('Opened Package ID:', this.packageId);

        this.packageService.getPackageById(this.packageId).subscribe({
            next: (response: any) => {
                console.log('Fetched package details:', response);
                // Corrected assignment: handle both direct object and 'data' wrapper
                this.packageDetails = response.data || response;
            },
            error: (err) => {
                console.error('Failed to fetch package details', err);
                this.packageDetails = undefined; // Clear details on error
            }
        });
    } else {
        console.error('Package ID not found in route parameters.');
        this.packageDetails = undefined;
        // Optionally, navigate away or show an error message
        this.router.navigate(['/customer-dashboard']);
    }
  }
 
    // Ensure these methods pass a number for packageId
  goToReview(): void {
    if (this.packageId) {
      this.router.navigate(['/review-dashboard', this.packageId]);
    }
  }
  goToBooking(): void {
    if (this.packageId) {
      this.router.navigate(['/booking', this.packageId]);
    }
  }
  addInsurance(): void {
    if (this.packageId) {
      this.router.navigate(['/insurance-selection', this.packageId]);
    }
  }
    
  }