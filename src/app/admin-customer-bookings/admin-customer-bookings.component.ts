import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-admin-customer-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-customer-bookings.component.html',
  styleUrls: ['./admin-customer-bookings.component.css']
})
export class AdminCustomerBookingsComponent implements OnInit {
 
  customerId: number = 0;
  bookings: any[] = []; // To store list of bookings
  message: string = ''; // To show 'No bookings' message
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private location: Location
  ) {}
 

  goBack(): void{
    this.location.back();
  }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchBookings();
  }
 
  fetchBookings(): void {
    const token = localStorage.getItem('token');
 
this.http.get<[]>(`http://localhost:8080/api/users/${this.customerId}/bookings`, {
  headers: { Authorization: `Bearer ${token}` }
}).subscribe({
  next: (res) => {
    console.log("Bookings fetched:", res);
    this.bookings = res;
    this.message = res.length === 0 ? 'No bookings found yet.' : '';
  },
  error: (err) => {
    console.error("Failed to fetch bookings:", err);
    this.bookings = [];
    this.message = 'Access denied or no data found';
  }
});
  }
}