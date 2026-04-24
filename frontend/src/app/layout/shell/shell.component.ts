import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
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
