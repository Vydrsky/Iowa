import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AdminGuard: CanActivateFn = (route, state) => {
  let adminCookie = sessionStorage.getItem('admin') ?? null;
  if(adminCookie) {
    return true;
  }
  else {
    inject(Router).navigate(['login']);
    return false;
  }
};
