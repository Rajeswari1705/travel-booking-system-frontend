import { TestBed } from '@angular/core/testing';
import { AuthExpiredInterceptor } from './auth-expired.interceptor';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
describe('AuthExpiredInterceptor', () => {
  let interceptor: AuthExpiredInterceptor;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthExpiredInterceptor,
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: ToastrService, useValue: { warning: jasmine.createSpy() } }
      ]
    });
    interceptor = TestBed.inject(AuthExpiredInterceptor);
  });
 
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});