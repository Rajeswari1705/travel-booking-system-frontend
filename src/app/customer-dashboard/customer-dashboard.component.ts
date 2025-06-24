
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';

import { Component, OnInit } from '@angular/core';
import { PackageService } from '../services/package.service';
import { TravelPackage } from '../models/travel-package';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-customer-dashboard',

  imports: [DashboardNavbarComponent, CommonModule],

  standalone: true,
  

  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  packages: TravelPackage[] = [];

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe({
      next: (response) => {
        console.log('API response:', response); // ✅ Still useful for debugging
        this.packages = response.data; // ✅ Fix: assign only the array
      },
      error: (error) => {
        console.error('Error loading packages:', error);
      }
    });
  }
  
}
