import { Component } from '@angular/core';
import { LandingNavbarComponent } from '../landing-navbar/landing-navbar.component';
 
@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [LandingNavbarComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {}