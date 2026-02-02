import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already logged in, redirect to home
  if (authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
