import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';
import { CommonModule } from '@angular/common';

interface UserRoleCountResponse {
  totalUsers: number;
  agentCount: number;
  customerCount: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [DashboardNavbarComponent, CommonModule]
})
export class AdminDashboardComponent implements OnInit {

  totalUsers: number = 0;
  totalAgents: number = 0;
  totalCustomers: number = 0;

  sidebarCollapsed: boolean = true;  // Used to toggle the sidebar
  showTotal: string = '';  // 'users', 'agents', or 'customers' - **Starts as empty, hiding the card initially**

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserCounts();
  }

  // Toggle the sidebar open/close
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Navigate to admin-user-manage
  goToManageUsers(): void {
    this.router.navigate(['/admin-user-manage']);
  }

  // Fetch total user, agent, and customer counts from backend
  fetchUserCounts(): void {
    const token = localStorage.getItem('token');

    this.http.get<UserRoleCountResponse>('http://localhost:8080/api/users/counts', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.totalUsers = res.totalUsers;
        this.totalAgents = res.agentCount;
        this.totalCustomers = res.customerCount;
        // it's updated on sidebar click
      },
      error: () => this.toastr.error('Failed to fetch user counts.')
    });
  }
}