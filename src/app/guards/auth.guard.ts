import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../account/account.service';

export const authGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const router = inject(Router);
  if (!accountService.isLoggedIn()) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
