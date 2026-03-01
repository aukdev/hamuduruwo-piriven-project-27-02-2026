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
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(
    this.loadUser(),
  );
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.currentUser$.pipe(map((u) => !!u));

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
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
      .pipe(tap((res) => this.handleAuth(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
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
}
