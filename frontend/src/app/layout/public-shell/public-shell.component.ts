import { Component } from '@angular/core';

@Component({
  selector: 'app-public-shell',
  template: `
    <app-public-header></app-public-header>
    <main class="public-content">
      <router-outlet></router-outlet>
    </main>
    <app-public-footer></app-public-footer>
  `,
  styles: [
    `
      .public-content {
        min-height: 100vh;
        padding-top: 68px;
      }
      @media (max-width: 768px) {
        .public-content {
          padding-top: 60px;
        }
      }
    `,
  ],
})
export class PublicShellComponent {}
