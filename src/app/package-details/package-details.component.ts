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
     packageId!: string;
    // travelPackage!: TravelPackage;
   packageDetails:any;
constructor( private route: ActivatedRoute,
   private packageService: TravelPackageService, 
   private router: Router ) {}
 
ngOnInit(): void {
   this.packageId = this.route.snapshot.paramMap.get('packageId') || '';
   console.log('Opened Package ID:', this.packageId);
  
   this.packageService.getPackageById(this.packageId).subscribe({
     next: (response:any) => {
       console.log('Fetched package details:', response);
       this.packageDetails = response.data;  // ✅ FIXED HERE
     },
     error: (err) => {
       console.error('Failed to fetch package details', err);
     }
   });
 }
 
   goToReview(): void {
      this.router.navigate(['/review-dashboard', this.packageId]);
    }
    goToBooking(): void {
      this.router.navigate(['/booking', this.packageId]);
    }
    addInsurance(): void {
      this.router.navigate(['/insurance', this.packageId]);
    }
    
  }