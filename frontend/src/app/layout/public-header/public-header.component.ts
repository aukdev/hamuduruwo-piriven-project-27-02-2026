import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss'],
})
export class PublicHeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;
  isDark$ = this.themeService.isDark$;
  currentUser$ = this.authService.currentUser$;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  goToDashboard(): void {
    this.authService.navigateByRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
