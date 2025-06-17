import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  standalone: true,
  selector: 'app-admin-user-manage',
  imports: [FormsModule],
  templateUrl: './admin-user-manage.component.html',
  styleUrls: ['./admin-user-manage.component.css']
})
export class AdminUserManageComponent implements OnInit {
  users: any[] = [];
 
  constructor(private http: HttpClient, private toastr: ToastrService) {}
 
  ngOnInit(): void {
    this.fetchUsers();
  }
 
  fetchUsers() {
    const token = localStorage.getItem('token');
this.http.get<any[]>('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((res: any[]) => {
      this.users = res;
    });
  }
 
  updateUser(user: any) {
    const token = localStorage.getItem('token');
this.http.put(`http://localhost:8080/api/users/${user.id}`, user, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.toastr.success('User updated'),
      error: () => this.toastr.error('Update failed')
    });
  }
 
  deleteUser(id: number) {
    const token = localStorage.getItem('token');
this.http.delete(`http://localhost:8080/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.toastr.success('User deleted');
        this.fetchUsers(); // refresh list
      },
      error: () => this.toastr.error('Delete failed')
    });
  }
}