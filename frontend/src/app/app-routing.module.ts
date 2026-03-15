import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  /* ── Public pages (with public header + footer) ── */
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public.module').then((m) => m.PublicModule),
      },
    ],
  },

  /* ── Student ── */
  {
    path: 'student',
    component: ShellComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STUDENT'] },
    loadChildren: () =>
      import('./features/student/student.module').then((m) => m.StudentModule),
  },

  /* ── Teacher ── */
  {
    path: 'teacher',
    component: ShellComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TEACHER'] },
    loadChildren: () =>
      import('./features/teacher/teacher.module').then((m) => m.TeacherModule),
  },

  /* ── Admin ── */
  {
    path: 'admin',
    component: ShellComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },

  /* ── Super Admin ── */
  {
    path: 'superadmin',
    component: ShellComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadChildren: () =>
      import('./features/superadmin/superadmin.module').then(
        (m) => m.SuperadminModule,
      ),
  },

  /* ── Catch-all ── */
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
