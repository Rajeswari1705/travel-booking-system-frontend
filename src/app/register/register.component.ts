import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // ✅ Import the toast service
 
@Component({
  selector: 'app-register',       // HTML tag to use this component
  standalone: true,               // ✅ Standalone mode (no app.module.ts needed)
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]          // ✅ Required to use [(ngModel)]
})
export class RegisterComponent {
 
  // ✅ User model bound to the form fields in HTML
  user = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'CUSTOMER'              // Default role is CUSTOMER
  };
 
  // ✅ Inject HttpClient to send requests & ToastrService for notifications
  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}
 
  // ✅ This runs when the user submits the form
  onSubmit() {
    // POST user data to backend API via API Gateway
this.http.post('http://localhost:8080/api/users/register', this.user)
      .subscribe({
        next: (response) => {
          // ✅ Show success toast if registration is successful
          this.toastr.success('✅ Registration successful!');
        },
        error: (err) => {
          console.error(err);
          
          // ✅ Show custom toast messages based on backend status code
          if (err.status === 400 || err.status === 409) {
            // Validation error or email/phone already exists
            this.toastr.error('❌ ' + err.error.message);
          } else {
            // Other error
            this.toastr.error('❌ Something went wrong. Try again.');
          }
        }
      });
  }
}