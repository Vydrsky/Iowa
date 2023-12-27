import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const GameEndedGuard: CanActivateFn = (route, state) => {
  let gameEnded = inject(CookieService).get('archived') ?? null;
  if(gameEnded) {
    return true;
  }
  else {
    inject(Router).navigate(['game']);
    return false;
  }
};
