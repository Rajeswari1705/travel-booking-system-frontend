import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-package',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './view-package.component.html',
  styleUrl: './view-package.component.css'
})
export class ViewPackageComponent implements OnInit {

  packageId!: number;
  packageData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, public router: Router){}

  ngOnInit(): void {
    this.packageId = Number(this.route.snapshot.paramMap.get('id'));
    const url = `http://localhost:8080/api/packages/$(this.packageId)`;

    this.http.get<any>(url).subscribe({
      next: (res) => this.packageData = res.data,
      error: (err) =>{
        console.error('Error fetching package', err);
        alert('Failed to load package details');
      }
    });
  }
}
