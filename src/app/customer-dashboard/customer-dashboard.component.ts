// import { Component, OnInit } from '@angular/core';
// import { TravelPackageService } from '../services/package.service';
// import { TravelPackage } from '../models/travel-package';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';

// @Component({
//   selector: 'app-customer-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DashboardNavbarComponent],
//   templateUrl: './customer-dashboard.component.html',
//   styleUrls: ['./customer-dashboard.component.css']
// })
// export class CustomerDashboardComponent implements OnInit {
//   packages: TravelPackage[] = [];
//   filteredPackages: TravelPackage[] = [];

//   searchText: string = '';
//   minPrice: number | null = null;
//   maxPrice: number | null = null;

//   constructor(
//     private packageService: TravelPackageService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.packageService.getAllPackages().subscribe({
//       next: (data: any) => {
//         this.packages = Array.isArray(data) ? data : data.data;
//         this.filteredPackages = [...this.packages];
//         console.log('Packages:', this.packages);
//       },
//       error: (err) => console.error("Failed to load packages", err)
//     });
//   }

//   searchPackages(): void {
//     const text = this.searchText.toLowerCase();

//     this.filteredPackages = this.packages.filter(pkg => {
//       const matchesText =
//         pkg.title?.toLowerCase().includes(text) ||
//         pkg.destination?.toLowerCase().includes(text) ||
//         pkg.description?.toLowerCase().includes(text) ||
//         pkg.price?.toString().includes(text);

//       const matchesPrice =
//         (this.minPrice === null || pkg.price >= this.minPrice) &&
//         (this.maxPrice === null || pkg.price <= this.maxPrice);

//       return matchesText && matchesPrice;
//     });
//   }

//   clearSearch(): void {
//     this.searchText = '';
//     this.minPrice = null;
//     this.maxPrice = null;
//     this.filteredPackages = [...this.packages];
//   }

//   viewPackageDetails(packageId: string): void {
//     this.router.navigate(['/package', packageId]);
//   }
// }




// src/app/customer-dashboard/customer-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { TravelPackageService } from '../services/package.service';
import { TravelPackage } from '../models/travel-package';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardNavbarComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  packages: TravelPackage[] = [];
  filteredPackages: TravelPackage[] = [];

  searchText: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  exactDuration: number | null = null;

  constructor(
    private packageService: TravelPackageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackagesWithRatings();
  }

  loadPackagesWithRatings(): void {
    this.packageService.getAllPackages().subscribe({
      next: (data: TravelPackage[]) => {
        this.packages = data;
        this.filteredPackages = [...this.packages];
        this.fetchAverageRatings(); // Call after packages are loaded
      },
      error: (err) => console.error("Failed to load packages", err)
    });
  }

  fetchAverageRatings(): void {
    if (this.packages.length === 0) {
      return;
    }

    const ratingRequests = this.packages.map(pkg =>
      // pkg.packageId is already number here, so no conversion needed
      this.packageService.getAverageRatingForPackage(pkg.packageId).pipe(
        map(avgRating => ({ packageId: pkg.packageId, averageRating: avgRating })),
        catchError(error => {
          console.error(`Error fetching average rating for package ${pkg.packageId}:`, error);
          return of({ packageId: pkg.packageId, averageRating: 0.0 }); // Default to 0.0 on error
        })
      )
    );

    forkJoin(ratingRequests).subscribe({
      next: (ratings: { packageId: number, averageRating: number }[]) => { // packageId is now number
        ratings.forEach(rating => {
          const pkg = this.packages.find(p => p.packageId === rating.packageId);
          if (pkg) {
            pkg.averageRating = rating.averageRating;
          }
        });
        this.searchPackages(); // Re-filter to ensure average ratings are applied to the displayed packages
      },
      error: (err) => console.error("Failed to fetch average ratings", err)
    });
  }

  searchPackages(): void {
    const text = this.searchText.toLowerCase();

    this.filteredPackages = this.packages.filter(pkg => {
      const matchesText =
        pkg.title?.toLowerCase().includes(text) ||
        pkg.destination?.toLowerCase().includes(text) ||
        pkg.description?.toLowerCase().includes(text) ||
        pkg.country?.toLowerCase().includes(text) ||
        pkg.tripType?.toLowerCase().includes(text) ||
        pkg.price?.toString().includes(text);


      const matchesPrice =
        (this.minPrice === null || pkg.price >= this.minPrice) &&
        (this.maxPrice === null || pkg.price <= this.maxPrice);

      const matchesDuration =
        this.exactDuration === null || pkg.duration === this.exactDuration;

      return matchesText && matchesPrice && matchesDuration;
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.exactDuration = null;
    this.filteredPackages = [...this.packages];
  }

  // Changed packageId type to number
  viewPackageDetails(packageId: number): void {
    this.router.navigate(['/packages', packageId]);
  }

  getStarArray(rating: number | undefined): number[] {
    if (rating === undefined || rating === 0) {
      return [];
    }
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return [
      ...Array(fullStars).fill(1),
      ...(halfStar ? [0.5] : []),
      ...Array(emptyStars).fill(0)
    ];
  }
}