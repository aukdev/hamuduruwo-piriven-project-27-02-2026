import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const TOKEN_KEY = 'piriven_token';
const USER_KEY = 'piriven_user';

function showError(
  snackBar: MatSnackBar,
  message: string,
  duration = 5000,
): void {
  snackBar.open(message, '✕', {
    duration,
    panelClass: ['snack-error'],
    horizontalPosition: 'end',
    verticalPosition: 'top',
  });
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        router.navigate(['/login']);
        showError(snackBar, 'සැසිය කල් ඉකුත් විය. නැවත පිවිසෙන්න.');
      } else if (error.status === 403) {
        showError(snackBar, 'මෙම ක්‍රියාව සඳහා අවසර නැත.');
      } else if (error.status === 0) {
        showError(snackBar, 'සේවාදායකය සම්බන්ධ කළ නොහැක.');
      }

      return throwError(() => error);
    }),
  );
};
