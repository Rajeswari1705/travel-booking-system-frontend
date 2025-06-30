// Import Routes type from Angular Router
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { AdminUserManageComponent } from './admin-user-manage/admin-user-manage.component';
import { CustomerHelpComponent } from './customer-help/customer-help.component';
import { CustomerInsuranceComponent } from './customer-insurance/customer-insurance.component';
import { LandingNavbarComponent } from './landing-navbar/landing-navbar.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
 
  // Dashboard placeholders
  { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'agent-dashboard', loadComponent: () => import('./agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent) },
  { path: 'customer-dashboard', loadComponent: () => import('./customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
  { path: 'my-profile', loadComponent: () => import('./my-profile/my-profile.component').then(m => m.MyProfileComponent) },
  { path: 'admin/users', loadComponent: () => import('./admin-user-manage/admin-user-manage.component').then(m => m.AdminUserManageComponent) },
  { path: 'update-profile', loadComponent: () => import('./update-profile/update-profile.component').then(m => m.UpdateProfileComponent) },
  { path: 'admin-user-manage' , loadComponent: () => import('./admin-user-manage/admin-user-manage.component').then(m =>AdminUserManageComponent)},
  { path: 'admin/agent-packages/:id', loadComponent: () => import('./admin-agent-packages/admin-agent-packages.component').then(m => m.AdminAgentPackagesComponent)},
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)},
  

  //For creating new package by agent
  { path: 'create-package', loadComponent:() => import('./agent-create-package/agent-create-package.component').then(m=> m.AgentCreatePackageComponent)},

  //for landing navbar
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
{ path: 'contact-us', loadComponent: () => import('./contact-us/contact-us.component').then(m => m.ContactUsComponent) },



  //For package editing/updating in agent dashboard
  { path: 'edit-package/:id', loadComponent:() => import('./edit-package/edit-package.component').then(m => m.EditPackageComponent)},

  //For viewing the details of the package by the agent(retrieve)
  { path: 'view-package/:id', loadComponent:() => import('./view-package/view-package.component').then(m => m.ViewPackageComponent)},
  
  //for help and insurance

  {
    path: 'customer-help',
    loadComponent: () =>
      import('./customer-help/customer-help.component').then(
        (m) => m.CustomerHelpComponent
      ),
  },
  {
    path: 'customer-insurance',
    loadComponent: () =>
      import('./customer-insurance/customer-insurance.component').then(
        (m) => m.CustomerInsuranceComponent
      ),
  },
  //For customer dashboard ,review dashboard,loading of package details
  { path: '', redirectTo: 'customer-dashboard', pathMatch: 'full' }, 
  { path: 'package/:packageId', loadComponent: () => import('./package-details/package-details.component').then(m => m.PackageDetailsComponent) },
  { path: 'review-dashboard/:packageId', loadComponent: () => import('./review-dashboard/review-dashboard.component').then(m => m.ReviewDashboardComponent) },
  { path: 'package/:packageId', loadComponent: () => import('./package-details/package-details.component').then(m => m.PackageDetailsComponent) },
];

