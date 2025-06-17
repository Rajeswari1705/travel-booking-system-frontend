import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  standalone: true,
  selector: 'app-my-profile',
  imports: [FormsModule], 
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  user: any = {};
 
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}
 
  ngOnInit(): void {
    this.loadProfile();
  }
 
  loadProfile() {
    const token = localStorage.getItem('token');
this.http.get('http://localhost:8080/api/users/myprofile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(res => this.user = res);
  }
 
  updateProfile() {
    const token = localStorage.getItem('token');
this.http.put('http://localhost:8080/api/users/myprofile', this.user, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.toastr.success('Profile updated'),
      error: () => this.toastr.error('Update failed')
    });
  }
 
  deleteProfile() {
    const token = localStorage.getItem('token');
this.http.delete('http://localhost:8080/api/users/myprofile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        localStorage.clear();
        this.toastr.success('Profile deleted');
        this.router.navigate(['/']);
      },
      error: () => this.toastr.error('Delete failed')
    });
  }

  goToUpdate(){
    this.router.navigate(['/update-profile']);
  }
 
  logout() {
    localStorage.clear();
    this.toastr.success('Logged out');
    this.router.navigate(['/']);
  }
}