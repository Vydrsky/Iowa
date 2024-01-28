import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const LoggedInGuard: CanActivateFn = (route, state) => {
  let authCookie = sessionStorage.getItem('token') ?? null;
  if (!authCookie) {
    return true;
  }
  else {
    inject(Router).navigate(['game']);
    return false;
  }
};
