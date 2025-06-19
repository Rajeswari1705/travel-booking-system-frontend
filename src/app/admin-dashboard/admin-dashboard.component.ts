import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
 
interface UserRoleCountResponse {
  totalUsers: number;
  agentCount: number;
  customerCount: number;
}


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
 
  totalUsers: number = 0;
  totalAgents: number = 0;
  totalCustomers: number = 0;
 
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.fetchUserCounts();
  }
 
  fetchUserCounts() {
    const token = localStorage.getItem('token');
 
this.http.get<UserRoleCountResponse>('http://localhost:8080/api/users/counts', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.totalUsers = res.totalUsers;
        this.totalAgents = res.agentCount;
        this.totalCustomers = res.customerCount;
      },
      error: () => this.toastr.error('Failed to fetch user counts.')
    });
  }
 
  goToProfile() {
    this.router.navigate(['/my-profile']);
  }

  goToManageUsers() {
    this.router.navigate(['/admin-user-manage']);
  }

}