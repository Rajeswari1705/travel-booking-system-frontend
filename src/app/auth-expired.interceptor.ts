import { Injectable } from '@angular/core';

import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
//this class adds auth tokens to requests, and watches for 401/403 responses

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
 
  constructor(private router: Router, private toastr: ToastrService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem('token');
 
    //if token is found, add it to the authorization header
    const authReq = token
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
      : req;
 
      //if http status code 401 or 403, show warning toast, clear token from local storage
      //then redirect user to /login
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.toastr.warning('Session expired. Please log in again.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
 
        return throwError(() => error);
      })
    );
  }
}