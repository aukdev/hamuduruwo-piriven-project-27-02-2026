import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AppRole,
} from '../models';

const TOKEN_KEY = 'piriven_token';
const USER_KEY = 'piriven_user';

export interface CurrentUser {
  userId: string;
  email: string;
  fullName: string;
  role: AppRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  currentUser$: Observable<CurrentUser | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Validate token on startup; clear stale data
    const user = this.loadUser();
    const token = localStorage.getItem(TOKEN_KEY);
    if (user && token && !this.isTokenExpired(token)) {
      this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(user);
    } else {
      // Clear invalid/expired state to prevent white screen
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
    }
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticated$ = this.currentUser$.pipe(map((u) => !!u));
  }

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t && this.isTokenExpired(t)) {
      this.logout();
      return null;
    }
    return t;
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  hasRole(...roles: AppRole[]): boolean {
    return !!this.currentUser && roles.includes(this.currentUser.role);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/login`, req)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/register`, req)
      .pipe(
        tap((res) => {
          if (res.token) {
            this.handleAuth(res);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** Navigate the user to their role-specific dashboard */
  navigateByRole(): void {
    const role = this.currentUser?.role;
    switch (role) {
      case 'STUDENT':
        this.router.navigate(['/student']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'SUPER_ADMIN':
        this.router.navigate(['/superadmin']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token!);
    const user: CurrentUser = {
      userId: res.userId,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUser(): CurrentUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  /** Decode JWT and check if expired */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      // 30-second buffer to account for clock skew
      return payload.exp * 1000 < Date.now() - 30000;
    } catch {
      return true; // Malformed token = expired
    }
  }
}
