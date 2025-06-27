import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';


@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, DashboardNavbarComponent],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent implements OnInit{

  packages: any[] = []; //store the list of travel packages
  agentId :number=0;

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

  //Delete a package
  deletePackage(id: number){
    if(!id){
      console.error('Invalid package ID:',id);
      alert('Error: Cannot delete package. Invalid ID.');
      return ;
    }
    const confirmDelete = confirm("Are you sure you want to delete this package?");
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

  //placeholder for edit
  editPackage(pkg: any){
    alert('Edit package: ${pkg.title} - feature coming soon!');
  }
  //Go to my profile 
  goToProfile(){
    window.location.href = '/my-profile';
  }

  
  



}
