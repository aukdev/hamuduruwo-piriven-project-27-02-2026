import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'piriven-theme';
  private readonly isBrowser: boolean;
  private themeSubject: BehaviorSubject<Theme>;

  isDark$ = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    const saved = this.getSavedTheme();
    this.themeSubject = new BehaviorSubject<Theme>(saved);
    this.applyTheme(saved);
  }

  get theme(): Theme {
    return this.themeSubject.value;
  }

  toggle(): void {
    const next: Theme = this.theme === 'light' ? 'dark' : 'light';
    this.themeSubject.next(next);
    this.isDark$.next(next === 'dark');
    this.applyTheme(next);
    this.saveTheme(next);
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
    this.isDark$.next(theme === 'dark');
  }

  private getSavedTheme(): Theme {
    if (!this.isBrowser) return 'light';
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  }

  private saveTheme(theme: Theme): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
