import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink], // Enable routerLink directive in template
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
  
})
export class LandingComponent {}
