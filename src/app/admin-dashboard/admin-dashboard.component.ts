import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common'; // needed for *ngIf, *ngFor;
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  role: string = '';
  users: any[] = [];
 
  constructor(private http: HttpClient, private toastr: ToastrService) {}
 
  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
 
    if (this.role === 'ADMIN') {
      this.fetchUsers();
    } else {
      this.toastr.warning('Access denied. Only admins can view users.');
    }
  }
 
  fetchUsers() {
    const token = localStorage.getItem('token');
 
this.http.get<any[]>('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => this.users = res,
      error: (err) => {
        this.toastr.error('Could not load users.');
        console.error(err);
      }
    });
  }
}