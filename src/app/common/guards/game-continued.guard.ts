import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../../generated/services';
import { map, take } from 'rxjs';

export const GameContinuedGuard: CanActivateFn = (route, state) => {
  let userService = inject(UserService);
  let router = inject(Router);
  return userService.getUser({ id: sessionStorage.getItem('userId') ?? '' }).pipe(take(1), map((user) => {
    if (user.isArchived) {
      sessionStorage.clear();
      router.navigate(['summary']);
      return false;
    }
    return true;
  }))
};
