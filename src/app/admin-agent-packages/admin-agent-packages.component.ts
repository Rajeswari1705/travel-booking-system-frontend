import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-admin-agent-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-agent-packages.component.html',
  styleUrls: ['./admin-agent-packages.component.css']
})
export class AdminAgentPackagesComponent implements OnInit {
  agentId!: number; // ! tells ts we will initiate it later
  packages: any[] = [];
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  goBack(): void{
    this.location.back();
  }
 
  ngOnInit(): void {
    // Get agent ID from route parameter
    this.agentId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Agent ID:",this.agentId);
 
    // Call backend to fetch agent's packages
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 
    this.http
    .get<any>(`http://localhost:8080/api/packages/agent/${this.agentId}`)
      .subscribe({
        next: (res) => {
          console.log("Fetched packages", res);
          this.packages = res.data; // res is the full object, data contains array
        },
        error: (err) => {
          console.error('Failed to fetch packages', err);
          this.packages = [];
        }
      });
  }
  
}