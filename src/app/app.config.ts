import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { ApiModule } from '../generated/api.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimations(), 
    provideHttpClient(), 
    importProvidersFrom(ApiModule.forRoot({ rootUrl: "https://localhost:8000" })),
  ]
};
