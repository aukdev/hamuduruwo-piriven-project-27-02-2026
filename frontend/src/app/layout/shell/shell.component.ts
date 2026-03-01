import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shell',
  template: `
    <app-navbar></app-navbar>
    <mat-sidenav-container class="shell-container">
      <mat-sidenav
        #sidenav
        [mode]="isMobile ? 'over' : 'side'"
        [opened]="!isMobile"
        class="shell-sidenav"
      >
        <app-sidebar></app-sidebar>
      </mat-sidenav>
      <mat-sidenav-content class="shell-content">
        <div class="shell-content__inner">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .shell-container {
        position: fixed;
        top: 64px;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .shell-sidenav {
        width: 260px;
        background: #ffffff;
      }
      .shell-content {
        background: #f6f7fb;
      }
      .shell-content__inner {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }
      @media (max-width: 768px) {
        .shell-content__inner {
          padding: 16px;
        }
      }
    `,
  ],
})
export class ShellComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  private sub!: Subscription;

  constructor(private breakpoint: BreakpointObserver) {}

  ngOnInit(): void {
    this.sub = this.breakpoint
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.sidenav) {
          if (this.isMobile) this.sidenav.close();
          else this.sidenav.open();
        }
      });

    // Allow navbar to toggle sidenav
    (window as any).__toggleSidenav = () => this.sidenav?.toggle();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    delete (window as any).__toggleSidenav;
  }
}
