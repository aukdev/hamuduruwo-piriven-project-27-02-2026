import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './shell/shell.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PublicHeaderComponent } from './public-header/public-header.component';
import { PublicFooterComponent } from './public-footer/public-footer.component';
import { PublicShellComponent } from './public-shell/public-shell.component';

@NgModule({
  declarations: [
    ShellComponent,
    NavbarComponent,
    SidebarComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
    PublicShellComponent,
  ],
  imports: [SharedModule],
  exports: [ShellComponent, PublicShellComponent],
})
export class LayoutModule {}
