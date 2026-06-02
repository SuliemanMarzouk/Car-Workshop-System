import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const CENTRAL_TOKEN_KEY = 'central_token';

function isCentralApiRequest(url: string): boolean {
  return url.includes('/central/');
}

export const centralTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isCentralApiRequest(request.url)) {
    return next(request);
  }

  const router = inject(Router);
  const token = localStorage.getItem(CENTRAL_TOKEN_KEY);

  const authRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('/central/auth/login')) {
        localStorage.removeItem(CENTRAL_TOKEN_KEY);
        void router.navigate(['/platform/login']);
      }

      return throwError(() => error);
    }),
  );
};
