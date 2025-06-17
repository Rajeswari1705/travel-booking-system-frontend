import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit {
  user: any = {};
  oldPassword: string = '';
  newPassword: string = '';
 
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}
 
  ngOnInit(): void {
    this.fetchUser();
  }
 
  fetchUser() {
    const token = localStorage.getItem('token');
this.http.get('http://localhost:8080/api/users/myprofile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => this.user = res,
      error: () => {
        this.toastr.error('Cannot fetch profile');
        this.router.navigate(['/']);
      }
    });
  }
 
  updateProfile() {
    const token = localStorage.getItem('token');
    const updatePayload = {
      ...this.user,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };
 
this.http.put('http://localhost:8080/api/users/myprofile', updatePayload, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.router.navigate(['/my-profile']);
      },
      error: () => this.toastr.error('Update failed')
    });
  }
}