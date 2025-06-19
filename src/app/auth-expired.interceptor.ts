import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
 
  constructor(private router: Router, private toastr: ToastrService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
 
    const authReq = token
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
      : req;
 
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