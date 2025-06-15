import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component'; // ✅ Make sure this path matches your folder
 
export const routes: Routes = [
  { path: '', component: LandingComponent } // 👈 Default route shows landing page
];