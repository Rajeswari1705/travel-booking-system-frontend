import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
 
// Required to provide routing
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
 
// Import standard modules for forms and HTTP
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptorsFromDi } from '@angular/common/http';
 
// ✅ Toast + Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';  // ✅ Use provideToastr here

//for interceptor for jwt token expiration
import { provideHttpClient } from '@angular/common/http';
import { AuthExpiredInterceptor } from './app/auth-expired.interceptor';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
 
bootstrapApplication(AppComponent, {
  providers: [

    provideHttpClient(withInterceptorsFromDi()),
    
    provideRouter(routes),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
    
    // ✅ Correct usage of importProvidersFrom for standard modules
    importProvidersFrom(
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule
    ),
 
    // ✅ provideToastr must be outside importProvidersFrom
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    }),

    provideLottieOptions({ player: () => player })

  ]
});