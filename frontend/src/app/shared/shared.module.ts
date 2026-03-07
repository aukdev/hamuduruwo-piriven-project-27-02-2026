import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* ── Angular Material Modules ── */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';

/* ── Shared Components ── */
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { TimerDisplayComponent } from './components/timer-display/timer-display.component';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './components/reset-password-dialog/reset-password-dialog.component';
import { CreateUserDialogComponent } from './components/create-user-dialog/create-user-dialog.component';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSnackBarModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatChipsModule,
  MatBadgeModule,
  MatTooltipModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule,
  MatDividerModule,
  MatExpansionModule,
  MatRippleModule,
];

const SHARED_COMPONENTS = [
  PageHeaderComponent,
  EmptyStateComponent,
  ConfirmDialogComponent,
  LoadingOverlayComponent,
  TimerDisplayComponent,
  EditUserDialogComponent,
  ResetPasswordDialogComponent,
  CreateUserDialogComponent,
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...MATERIAL_MODULES,
    ...SHARED_COMPONENTS,
  ],
})
export class SharedModule {}
