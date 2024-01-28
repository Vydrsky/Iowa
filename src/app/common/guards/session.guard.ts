import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const SessionGuard: CanActivateFn = (route, state) => {

  if(sessionStorage.getItem('userId') && sessionStorage.getItem('gameId') && sessionStorage.getItem('accountId')){
    return true;
  }
  sessionStorage.clear();
  inject(Router).navigate(['login']);
  return false;
};
