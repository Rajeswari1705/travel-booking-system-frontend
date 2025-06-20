import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-edit-package',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.css']
})
export class EditPackageComponent implements OnInit {
  packageId!: number;
  packageData: any = {};
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    // Capture ID from URL
    this.packageId = Number(this.route.snapshot.paramMap.get('id'));
    // Fetch existing package data
    this.http
      .get<any>(`http://localhost:8080/api/packages/${this.packageId}`)
      .subscribe(res => {
      this.packageData = res.data;
      }, err => {
        console.error('Error loading package', err);
        alert('Could not load package details.');
        this.router.navigate(['/agent-dashboard']);
      });
  }
 
  onSubmit(): void {
    this.http
      .put(`http://localhost:8080/api/packages/${this.packageId}`, this.packageData)
      .subscribe({
        next: () => {
          alert('Package updated successfully!');
          this.router.navigate(['/agent-dashboard']);
        },
        error: err => {
          console.error('Update failed', err);
          alert('Failed to update package. Check console for details.');
        }
      });
  }
}
