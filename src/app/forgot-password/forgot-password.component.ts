import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}
 
  // Called when user submits the form
  sendPassword(): void {
this.http.post('http://localhost:8080/api/users/forgot-password', { email: this.email })
      .subscribe({
        next: () => {
          this.toastr.success('Password sent to your email!');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toastr.error('Email not found!');
        }
      });
  }
}