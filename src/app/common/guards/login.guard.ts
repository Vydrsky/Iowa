import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const LoginGuard: CanActivateFn = (route, state) => {
 let auth = sessionStorage.getItem('token') ?? null;
  if(auth) {
    return true;
  }
  else {
    inject(Router).navigate(['login']);
    return false;
  }
};
