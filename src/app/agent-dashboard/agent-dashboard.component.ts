import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent implements OnInit{

  packages: any[] = []; //store the list of travel packages
  formVisible: boolean = false;
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

  private http = inject(HttpClient);

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    this.agentId = storedId ? parseInt(storedId, 10) : 0;
   
    if (this.agentId>0) {
      this.loadPackages();
    } else {
      console.error('Agent ID not found in localStorage');
      // optionally redirect to login page or show error
    }
  }


  //Get packages created by this agent
  loadPackages(){
    const url = `http://localhost:8080/api/packages/agent/${this.agentId}`;
    this.http.get<any>(url).subscribe({
      next: (res) =>{
        this.packages = res.data;
        console.log("Loaded packages:", this.packages);//optional debug
      } ,

      error: (err) => console.error('Error loading packages', err)

    });
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


  //Delete a package
  deletePackage(id: number){
    const confirmDelete = confirm("ARe you sure you want to delete this package?");
    if(!confirmDelete) return;

    const url = `http://localhost:8080/api/packages/${id}`;

    this.http.delete(url).subscribe({
      next: () => {
        alert('Package deleted successfully!');
        this.loadPackages();
      },
      error: (err) => {
        console.error('Error deleting package', err);
        alert('Failed to delete Package.')
      }
    });
  }


  //show or hide create form
  showCreateForm(){
    this.formVisible = true;
  }

  cancelForm() {
    this.formVisible = false;
  }


  //placeholder for edit
  editPackage(pkg: any){
    alert('Edit package: ${pkg.title} - feature coming soon!');
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

  addItineraryDay(){
    const newDay = this.newPackage.itinerary.length+1;
    this.newPackage.itinerary.push({
      dayNumber: newDay,
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


  //Go to my profile 
  goToProfile(){
    window.location.href = '/my-profile';
  }

  
  



}
