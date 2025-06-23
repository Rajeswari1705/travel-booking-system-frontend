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
  // packageData: any = {};



  newPackage: any = {
    title:'',
    description:'',
    duration:'',
    price:'',
    maxCapacity:'',
    country:'',
    destination:'',
    tripType:'',
    tripStartDate:'',
    tripEndDate:'',
    active: true,

    offer: { couponCode:'', description:'', discountPercentage: 0, active: false},

    flights: [
      {airline: '', fromCity:'', toCity:'', departureTime:'', arrivalTime:''}
    ],

    hotels: [
      {name:'', city:'', rating:'', nights:'', costPerNight:''}
    ],

    sightseeingList: [
      {location:'', description:''}
    ],

    itinerary: [
      {dayNumber:'', activityTitle:'', activityDescription:''}
    ]

  };
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    // Capture ID from URL
    this.packageId = Number(this.route.snapshot.paramMap.get('id'));
    // Fetch existing package data

    const url=`http://localhost:8080/api/packages/${this.packageId}`;
      this.http.get<any>(url).subscribe({
        next: (res) => {
          this.newPackage = res.data;
        },
        error: (err) => {
          console.error('Failed to fetch package',err);
          alert('Error loading package data.');
        }
      });
  }

  submitPackage(){
    const url=`http://localhost:8080/api/packages/${this.packageId}`;
      this.http.put(url, this.newPackage).subscribe({
        next: () => {
          alert('Package updated successfully!');
          this.router.navigate(['/agent-dashboard']);
        },
        error: (err) => 
        { console.error('Failed to update package',err);
          alert('Error updating package');
        }
      });
  }
 
  addItineraryDay(){
    const nextDay = this.newPackage.itinerary.length+1;
    this.newPackage.itinerary.push({
      dayNumber: nextDay,
      activityTitle: '',
      activityDescription: ''
    });

  }

  removeItineraryDay(index:number): void{
    this.newPackage.itinerary.splice(index,1);
    this.newPackage.itinerary.forEach((item: any, i: number) =>{
      item.dayNumber = i+1;
    });

  }

  // for sight seeing
  addSightseeing(): void {
    this.newPackage.sightseeingList.push({location:'', description:''});
  }

  removeSightseeing(index: number): void {
    this.newPackage.sightseeingList.splice(index,1);
  }


  cancelForm(){
    this.router.navigate(['/agent-dashboard']);
  }
}
