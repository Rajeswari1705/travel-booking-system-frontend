import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-manage',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './admin-user-manage.component.html',
  styleUrls: ['./admin-user-manage.component.css']
})
export class AdminUserManageComponent implements OnInit {

  users: any[] = [];

  filteredUsers: any[] = []; // This array will be displayed
  searchUserId: string = ''; // Binds to the search input
  selectedRoleFilter: string = 'ALL'; // NEW: Binds to the role filter dropdown

  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService, private location: Location) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  // 🔹 Fetch all users from backend
  fetchUsers(): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.users = res.filter(user => user.role && user.role.toUpperCase() !== 'ADMIN');
        this.applyFilter(); // MODIFIED: Apply filter after fetching users
      },
      error: () => this.toastr.error('Failed to load users')
    });
  }

  // MODIFIED: applyFilter now considers both ID and role
  applyFilter(): void {
    let tempFilteredUsers = [...this.users];

    // First, filter by role
    if (this.selectedRoleFilter !== 'ALL') {
      tempFilteredUsers = tempFilteredUsers.filter(user =>
        user.role.toUpperCase() === this.selectedRoleFilter.toUpperCase()
      );
    }

    // Then, filter by ID on the already role-filtered users
    if (this.searchUserId) {
      tempFilteredUsers = tempFilteredUsers.filter(user =>
        user.id.toString().toLowerCase().includes(this.searchUserId.toLowerCase())
      );
    }

    this.filteredUsers = tempFilteredUsers;
  }


  // NEW: Method for role filter change
  onRoleFilterChange(): void {
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchUserId = ''; // Clear the input field
    this.applyFilter(); // Re-apply filter to show all users based on current role filter
  }

  // Called when admin changes the role of a user from dropdown
  onRoleChange(user: any, event: Event): void {
    const selectedRole = (event.target as HTMLSelectElement).value;

    // Prevent manually assigning ADMIN role
    if (selectedRole === 'ADMIN') {
      this.toastr.warning('Admin role cannot be assigned manually.');
      // Revert the dropdown selection visually
      (event.target as HTMLSelectElement).value = user.role;
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
        // MODIFIED: Instead of fetching all users again, update the specific user in `users` array
        // and then re-apply filter to keep search state
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index].role = selectedRole; // Update the role directly
        }
        this.applyFilter(); // Re-apply filter to update filteredUsers
      },
      error: (err) => {
        console.error("❌ Role update failed:", err);
        this.toastr.error('Failed to update role');
        // Revert the dropdown selection visually on error
        (event.target as HTMLSelectElement).value = user.role;
      }
    });
  }

  // 🔹 Delete user
  deleteUser(id: number): void {
    const token = localStorage.getItem('token');

    this.http.delete(`http://localhost:8080/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text', //avoids json parsing
      observe: 'response'  // Observe the full HTTP response
    }).subscribe({
      next: (response) => {
        // Check if status is 200 OK or 204 No Content
        if (response.status === 200 || response.status === 204) {
          this.toastr.success('User deleted successfully');
          // MODIFIED: Remove user from `users` array and re-apply filter
          this.users = this.users.filter(user => user.id !== id);
          this.applyFilter(); // Update filteredUsers after deletion

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
    this.router.navigate(['/admin/agent-packages', agentId]);
  }


  //to go back to previous page
  goBack(): void {
    this.location.back();
  }

}