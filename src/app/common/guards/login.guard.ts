import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const LoginGuard: CanActivateFn = (route, state) => {
  let authCookie = inject(CookieService).get('userCode') ?? null;
  if(authCookie) {
    return true;
  }
  else {
    inject(Router).navigate(['login']);
    return false;
  }
};
