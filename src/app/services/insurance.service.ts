import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class InsuranceService {
  private baseUrl = 'http://localhost:8080/api'; // Only defined once
 
  constructor(private http: HttpClient) {}
 
  getAssistanceQueries(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/assistance/user/${userId}`);
  }
 
  addQuery(userId: number, issue: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/assistance`, { userId, issueDescription:issue });
  }  
 
  getMyInsurances(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/insurance/user/${userId}`);
  }
 
  getCoveragePlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/insurance/coverage-plans`);
  }
 
  submitInsurance(userId: number, coverageType: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/insurance`, { userId, coverageType });
  }
}
 