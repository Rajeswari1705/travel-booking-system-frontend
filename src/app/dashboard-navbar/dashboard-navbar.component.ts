import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit{
  role: string = '';

  ngOnInit(): void {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : '';
  }
}