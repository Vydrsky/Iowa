import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiModule } from '../generated/api.module';
import { HttpErrorInterceptor } from './common/interceptors/http-error.interceptor';
import { provideToastr } from 'ngx-toastr';
import { JwtTokenInterceptor } from './common/interceptors/jwt-token.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true
    },
    importProvidersFrom(ApiModule.forRoot({ rootUrl: environment.api })),
    provideToastr({
      maxOpened: 1,
      autoDismiss: true
    })
  ]
};
