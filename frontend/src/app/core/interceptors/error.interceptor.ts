import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private notify: NotificationService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.logout();
          this.notify.error('සැසිය කල් ඉකුත් විය. නැවත පිවිසෙන්න.');
        } else if (error.status === 403) {
          this.notify.error('මෙම ක්‍රියාව සඳහා අවසර නැත.');
        } else if (error.status === 0) {
          this.notify.error('සේවාදායකය සම්බන්ධ කළ නොහැක.');
        }
        return throwError(() => error);
      }),
    );
  }
}
