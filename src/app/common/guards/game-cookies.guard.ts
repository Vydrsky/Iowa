import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const GameCookiesGuard: CanActivateFn = (route, state) => {
  var cookieService = inject(CookieService)

  if(cookieService.check('userId') && cookieService.check('gameId') && cookieService.check('accountId')){
    return true;
  }
  cookieService.deleteAll();
  inject(Router).navigate(['login']);
  return false;
};
