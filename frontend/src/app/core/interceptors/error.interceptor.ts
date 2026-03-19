import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        notify.error('සැසිය කල් ඉකුත් විය. නැවත පිවිසෙන්න.');
      } else if (error.status === 403) {
        notify.error('මෙම ක්‍රියාව සඳහා අවසර නැත.');
      } else if (error.status === 0) {
        notify.error('සේවාදායකය සම්බන්ධ කළ නොහැක.');
      }
      return throwError(() => error);
    }),
  );
};
