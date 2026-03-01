import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRole } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRoles = route.data['roles'] as AppRole[];
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (this.auth.hasRole(...requiredRoles)) return true;
    // Redirect to appropriate dashboard
    const role = this.auth.currentUser?.role;
    switch (role) {
      case 'STUDENT':
        return this.router.createUrlTree(['/student']);
      case 'TEACHER':
        return this.router.createUrlTree(['/teacher']);
      case 'ADMIN':
        return this.router.createUrlTree(['/admin']);
      case 'SUPER_ADMIN':
        return this.router.createUrlTree(['/superadmin']);
      default:
        return this.router.createUrlTree(['/login']);
    }
  }
}
