import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const AdminGuard: CanActivateFn = (route, state) => {
  let adminCookie = inject(CookieService).get('admin') ?? null;
  if(adminCookie) {
    return true;
  }
  else {
    inject(Router).navigate(['login']);
    return false;
  }
};
