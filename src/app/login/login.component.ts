interface LoginResponse {
  token: string;
  role: string;
  id: number;
}

import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}
 
  login() {
this.http.post<LoginResponse>('http://localhost:8080/api/auth/login', this.credentials)
      .subscribe({
        next: (res) => {
          this.toastr.success('✅ Login successful');
          const role = res.role;
          const token = res.token;
          const id = res.id;

 
          // Save token to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('userId', id.toString());
 
          // Redirect based on role
          if (role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else if (role === 'AGENT') {
            this.router.navigate(['/agent-dashboard']);
          } else if (role === 'CUSTOMER') {
            this.router.navigate(['/customer-dashboard']);
          }
        },
        error: () => {
          this.toastr.error('❌ Invalid credentials');
        }
      });
  }

  navigateToForgotPassword(event: Event) {
    event.preventDefault();
    this.router.navigate(['/forgot-password']);
  }

}