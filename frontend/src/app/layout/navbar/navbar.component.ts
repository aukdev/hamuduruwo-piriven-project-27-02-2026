import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  sidenavOpen = true;
  user = this.auth.currentUser;
  private sub!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((u) => (this.user = u));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
    // Emit event via a simple callback approach
    (window as any).__toggleSidenav?.();
  }

  getRoleSinhala(role: string): string {
    const map: Record<string, string> = {
      SUPER_ADMIN: 'ප්‍රධාන පරිපාලක',
      ADMIN: 'පරිපාලක',
      TEACHER: 'ගුරුවරයා',
      STUDENT: 'ශිෂ්‍යයා',
    };
    return map[role] || role;
  }

  logout(): void {
    this.auth.logout();
  }
}
