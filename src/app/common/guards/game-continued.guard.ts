import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../../generated/services';
import { map, take } from 'rxjs';

export const GameContinuedGuard: CanActivateFn = (route, state) => {
  let cookieService = inject(CookieService);
  let userService = inject(UserService);
  let router = inject(Router);
  return userService.getUser({ id: cookieService.get('userId') ?? '' }).pipe(take(1), map((user) => {
    if (user.isArchived) {
      cookieService.deleteAll();
      router.navigate(['summary']);
      return false;
    }
    return true;
  }))
};
