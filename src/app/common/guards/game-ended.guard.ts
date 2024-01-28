import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const GameEndedGuard: CanActivateFn = (route, state) => {
  let gameEnded = sessionStorage.getItem('archived');
  if (gameEnded) {
    return true;
  }
  inject(Router).navigate(['game']);
  return false;
};
