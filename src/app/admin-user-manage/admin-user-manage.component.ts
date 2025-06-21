import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-admin-user-manage',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-user-manage.component.html',
  styleUrls: ['./admin-user-manage.component.css']
})
export class AdminUserManageComponent implements OnInit {
 
  users: any[] = [];
 
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) {}
 
  ngOnInit(): void {
    this.fetchUsers();
  }
 
  // 🔹 Fetch all users from backend
  fetchUsers(): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      //next: (res) => this.users = res,
      next: (res) => {
        this.users = res.filter(user => user.role && user.role.toUpperCase() !== 'ADMIN');
      },
      error: () => this.toastr.error('Failed to load users')
    });
  }
 
  // Called when admin changes the role of a user from dropdown
onRoleChange(user: any, event:Event): void {

  const selectedRole = (event.target as HTMLSelectElement).value;
 
  // Prevent manually assigning ADMIN role
  if (selectedRole === 'ADMIN') {
    this.toastr.warning('Admin role cannot be assigned manually.');
    return;
  }
 
  // Get token from localStorage
  const token = localStorage.getItem('token');
 
  // Create a copy of user with updated role
  const updatedUser = { ...user, role: selectedRole };
 
  // Make PUT request to update role
this.http.put(`http://localhost:8080/api/users/${user.id}`, updatedUser, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: () => {
      this.toastr.success('Role updated successfully');
      this.fetchUsers(); // Refresh the user list after update
    },
    error: () => {
      this.toastr.error('Failed to update role');
    }
  });
}
 
  // 🔹 Delete user
  deleteUser(id: number): void {
    const token = localStorage.getItem('token');
   
  this.http.delete(`http://localhost:8080/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text', //avoids json parsing
      observe: 'response'  //  Observe the full HTTP response
    }).subscribe({
      next: (response) => {
        // Check if status is 200 OK or 204 No Content
        if (response.status === 200 || response.status === 204) {
          this.toastr.success('User deleted successfully');
          window.location.reload(); // ⟳ Refresh the page to update the UI
        } else {
          this.toastr.error('Unexpected response from server');
        }
      },
      error: (err) => {
        console.error("❌ Delete failed:", err);
        this.toastr.error('Failed to delete user');
      }
    });
  }
 
  //view agent packages
  viewAgentPackages(agentId: number) {
    this.router.navigate(['/admin/agent-packages',agentId]);
  }
 
 
 
 
 
  /* deleteUser(id: number): void {
    const token = localStorage.getItem('token');
this.http.delete(`http://localhost:8080/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        //removes user from local list
        //this.users = this.users.filter(user => user.id !== id);
        this.toastr.success('User deleted');
        window.location.reload();
      },
      error: () => this.toastr.error('Failed to delete user')
    });
  }*/
}