import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 1. Importar esto
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './auth/auth.interceptor'; // 2. Importar tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync()]
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    // 3. Habilitar HttpClient con tu interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
