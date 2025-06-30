import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './agent-create-package.component.html',
  styleUrl: './agent-create-package.component.css'
})
export class AgentCreatePackageComponent {

  agentId :number=0;
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
    imageUrl:'',
    hightlights:[],
    active: true,

    offer: { couponCode:'', description:'', discountPercentage: 0, active: false},

    flights: [
      {airline: '', fromCity:'', toCity:'', departureTime:'', arrivalTime:''}
    ],

    hotels: [
      {name:'', city:'', rating:'', nights:'', costPerNight:''}
    ],

    sightseeing: [
      {location:'', description:''}
    ],

    itinerary: [
      {dayNumber:'', activityTitle:'', activityDescription:''}
    ]

  };
  private http= inject( HttpClient);
  private router= inject(Router);

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    this.agentId = storedId ? parseInt(storedId, 10) : 0;

    if(!this.agentId){
      alert('Agent ID nit found. Please login again.');
      this.router.navigate(['/login']);
    }
  }

  submitPackage(){
    const url= `http://localhost:8089/api/packages`;
    const fullData = {
      ...this.newPackage,
      agentId: this.agentId
    };
    this.http.post(url, fullData).subscribe({
      next: () => {
        alert('Package created successfully!');
        this.router.navigate(['/agent-dashboard']);
      },

      error: (err) => {
        console.error('Error correcting package', err);
        alert('Failed to create package. Check your input.');
      }
    });
  }

  //addItinerary
  addItineraryDay(){
    const newDay = this.newPackage.itinerary.length+1;
    this.newPackage.itinerary.push({
      dayNumber: newDay,
      activityTitle: '',
      activityDescription: ''
    });

  }

  //remove Itinerary
  removeItineraryDay(index:number): void{
    this.newPackage.itinerary.splice(index,1);
    this.newPackage.itinerary.forEach((item: any, i: number) =>{
      item.dayNumber = i+1;
    });

  }

  //add Sightseeing
  addSightseeing(): void {
    this.newPackage.sightseeing.push({location:'', description:''});
  }
  //remove sightseeing
  removeSightseeing(index: number): void {
    this.newPackage.sightseeing.splice(index,1);
  }

  cancelForm(): void{
    window.location.href = '/agent-dashboard';
  }

  highlightInput: string = '';
 
addHighlight() {
  if (this.highlightInput.trim()) {
    this.newPackage.highlights.push(this.highlightInput.trim());
    this.highlightInput = '';
  }
}
 
removeHighlight(index: number) {
  this.newPackage.highlights.splice(index, 1);
}
}
