import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TravelPackage } from '../models/travel-package';

interface PackageResponse {
  data: TravelPackage[];
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private baseUrl = 'http://localhost:8089/api/packages';

  constructor(private http: HttpClient) {}

  getAllPackages(): Observable<PackageResponse> {
    return this.http.get<PackageResponse>(this.baseUrl);
  }
}
