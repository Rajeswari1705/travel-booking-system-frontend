import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent implements OnInit{

  packages: any[] = []; //store the list of travel packages
  formVisible: boolean = false;
  agentId = 1;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.loadPackages();

  }
  //Get packages created by this agent
  loadPackages(){
    const url = `http://localhost:8080/api/packages/agent/${this.agentId}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => this.packages = data,
      error: (err) => console.error('Error loading packages',err)
    });
  }

  //Delete a package
  deletePackage(id: number){
    if(confirm('Are you sure you want to delete this package?')){
      const url = `http://localhost:8080/api/packages/${id}`;
      this.http.delete(url).subscribe({
        next: () => this.loadPackages(),
        error: (err) => console.error('Error deleting package', err)
      });
    }
  }

  //placeholder for edit
  editPackage(pkg: any){
    alert('Edit package: ${pkg.title} - feature coming soon!');
  }

  //placeholder for creating new package
  // createPackage(){
  //   alert('Cretae new Package feature coming soon!');
  // }

  

  //New package object

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

  //show or hide create form
  showCreateForm(){
    this.formVisible = true;
  }

  cancelForm() {
    this.formVisible = false;
  }


  //Reset form after success
  resetForm() {
    this.newPackage = {
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
  }

  //Submit new package to backend
  submitPackage(){
    const url= `http://localhost:8080/api/packages`;
    const fullData = {
      ...this.newPackage,
      agentId: this.agentId
    };
    this.http.post(url, fullData).subscribe({
      next: () => {
        alert('Package created successfully!');
        this.formVisible = false;
        this.loadPackages();
        this.resetForm();
      },

      error: (err) => {
        console.error('Error correcting package', err);
        alert('Failed to create package. Check your input.');
      }
    });


  }

  //Go to my profile 
  goToProfile(){
    window.location.href = '/my-profile';
  }

  
  



}
