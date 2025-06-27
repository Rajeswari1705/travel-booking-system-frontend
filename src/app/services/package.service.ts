// src/app/services/package.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TravelPackage } from '../models/travel-package';


@Injectable({
  providedIn: 'root'
})
export class TravelPackageService {
  private baseUrl = 'http://localhost:8089/api/packages'; // Assuming this is correct for your package management service
  private reviewBaseUrl = 'http://localhost:8084/api/reviews';
  
  constructor(private http: HttpClient) {}

  getAllPackages(): Observable<TravelPackage[]> { // Type as TravelPackage[] for consistency
    return this.http.get<any>(`${this.baseUrl}`).pipe( // Use any first, then map to TravelPackage[]
      map(response => Array.isArray(response) ? response : response.data)
    );
  }

  // CORRECTED: Changed packageId type to number
  getPackageById(packageId: number): Observable<TravelPackage> { // Type as TravelPackage
    return this.http.get<any>(`${this.baseUrl}/${packageId}`).pipe(
      map(response => response.data || response) // Robustly get the package data
    );
  }
    
  // Method to get average rating for a package from the RatingsAndReviews service
  getAverageRatingForPackage(packageId: number): Observable<number> {
    // The backend endpoint is /api/reviews/{packageId}/average-rating 
    return this.http.get<number>(`${this.reviewBaseUrl}/${packageId}/average-rating`);
  }
}