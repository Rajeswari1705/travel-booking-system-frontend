import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LandingNavbarComponent } from '../landing-navbar/landing-navbar.component';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, LandingNavbarComponent], // Enable routerLink directive in template
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
  
})
export class LandingComponent {}
