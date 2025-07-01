import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.css']
})
export class DashboardNavbarComponent implements OnInit {
 
  role: string = '';
 
  //  Emits when ☰ is clicked (to trigger sidebar toggle)
  @Output() sidebarToggle = new EventEmitter<void>();
 
  ngOnInit(): void {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : '';
  }
 
  // Triggered when hamburger is clicked
  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }
}