import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const GameContinuedGuard: CanActivateFn = (route, state) => {
  let gameEnded = inject(CookieService).get('archived');
  if (!gameEnded) {
    return true;
  }
  else {
    inject(Router).navigate(['summary']);
    return false;
  }
};
