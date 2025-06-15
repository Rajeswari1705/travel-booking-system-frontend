// Import Routes type from Angular Router
import { Routes } from '@angular/router';
 
// Import Landing and Register components to associate with paths
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
 
// Define list of routes for the app
export const routes: Routes = [
 
  // Default route (when visiting root URL) → shows LandingComponent
  { path: '', component: LandingComponent },
 
  // /register route → shows the register form
  { path: 'register', component: RegisterComponent }
 
];