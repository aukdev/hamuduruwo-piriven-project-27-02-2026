import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './shell/shell.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [ShellComponent, NavbarComponent, SidebarComponent],
  imports: [SharedModule],
  exports: [ShellComponent],
})
export class LayoutModule {}
