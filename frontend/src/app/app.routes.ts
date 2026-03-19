import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  /* ── Public pages (with public header + footer) ── */
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public.routes').then(
            (m) => m.PUBLIC_ROUTES,
          ),
      },
    ],
  },

  /* ── Student ── */
  {
    path: 'student',
    component: ShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
    loadChildren: () =>
      import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
  },

  /* ── Teacher ── */
  {
    path: 'teacher',
    component: ShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TEACHER'] },
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then((m) => m.TEACHER_ROUTES),
  },

  /* ── Admin ── */
  {
    path: 'admin',
    component: ShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  /* ── Super Admin ── */
  {
    path: 'superadmin',
    component: ShellComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    loadChildren: () =>
      import('./features/superadmin/superadmin.routes').then(
        (m) => m.SUPERADMIN_ROUTES,
      ),
  },

  /* ── Catch-all ── */
  { path: '**', redirectTo: '' },
];
