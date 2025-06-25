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




import { Component, OnInit } from '@angular/core';
import { TravelPackageService } from '../services/package.service';
import { TravelPackage } from '../models/travel-package';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';

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
    this.packageService.getAllPackages().subscribe({
      next: (data: any) => {
        this.packages = Array.isArray(data) ? data : data.data;
        this.filteredPackages = [...this.packages];
      },
      error: (err) => console.error("Failed to load packages", err)
    });
  }

  searchPackages(): void {
    const text = this.searchText.toLowerCase();

    this.filteredPackages = this.packages.filter(pkg => {
      const matchesText =
        pkg.title?.toLowerCase().includes(text) ||
        pkg.destination?.toLowerCase().includes(text) ||
        pkg.description?.toLowerCase().includes(text);

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

  viewPackageDetails(packageId: string): void {
    this.router.navigate(['/package', packageId]);
  }
}
