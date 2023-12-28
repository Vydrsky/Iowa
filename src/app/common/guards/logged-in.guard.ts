import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const LoggedInGuard: CanActivateFn = (route, state) => {
  let authCookie = inject(CookieService).get('token') ?? null;
  if (!authCookie) {
    return true;
  }
  else {
    inject(Router).navigate(['game']);
    return false;
  }
};
