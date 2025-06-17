import { inject, Injectable } from '@angular/core'; // Needed for DI without constructor
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
 
import { Router } from '@angular/router';            // Used to navigate to landing page
import { ToastrService } from 'ngx-toastr';          // Used to show toast messages
import { Observable, throwError } from 'rxjs';       // Observable for handling HTTP
import { catchError } from 'rxjs/operators';         // Used to catch HTTP errors
 
@Injectable() // Marks this class as injectable for Angular DI system
export class AuthExpiredInterceptor implements HttpInterceptor {
 
  // Injecting Router and ToastrService using Angular's inject() function
  private router = inject(Router);
  private toastr = inject(ToastrService);
 
  // This intercept method automatically runs for every outgoing HTTP request
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // Catch any errors in the HTTP response
      catchError((error: HttpErrorResponse) => {
 
        // If the error status is 401 (Unauthorized) or 403 (Forbidden),
        // it usually means token is invalid, expired, or user lacks permission
        if (error.status === 401 || error.status === 403) {
          
          // Show a red toast message to user
          this.toastr.error('Session expired or unauthorized. Please log in again.');
 
          // Clear the JWT token and role from localStorage (like logging out)
          localStorage.clear();
 
          // Redirect the user to the landing page
          this.router.navigate(['/']);
        }
 
        // Rethrow the error to allow other error handlers to catch it
        return throwError(() => error);
      })
    );
  }
}