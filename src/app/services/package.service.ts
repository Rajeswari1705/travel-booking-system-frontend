import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TravelPackage } from '../models/travel-package';


@Injectable({
  providedIn: 'root'
})
export class TravelPackageService {
  private baseUrl = 'http://localhost:8089/api/packages';

  constructor(private http: HttpClient) {}

  getAllPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getPackageById(packageId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${packageId}`);
  }
  // getPackageById(packageId: number | string) {
  //   return this.http.get(`/api/packages/${packageId}`);
  // }
   
  // getAllPackages() {
  //   return this.http.get(`/api/packages/all`);
  // }
}
