import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRole } from '../models';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as AppRole[];
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (auth.hasRole(...requiredRoles)) return true;
  // Redirect to appropriate dashboard
  const role = auth.currentUser?.role;
  switch (role) {
    case 'STUDENT':
      return router.createUrlTree(['/student']);
    case 'TEACHER':
      return router.createUrlTree(['/teacher']);
    case 'ADMIN':
      return router.createUrlTree(['/admin']);
    case 'SUPER_ADMIN':
      return router.createUrlTree(['/superadmin']);
    default:
      return router.createUrlTree(['/login']);
  }
};
