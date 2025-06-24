import { Component } from '@angular/core';
import { LandingNavbarComponent } from '../landing-navbar/landing-navbar.component';

@Component({
  selector: 'app-about',
  standalone:true,
  imports: [LandingNavbarComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
