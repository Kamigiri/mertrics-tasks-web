import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Error Interceptor
 * Handles backend custom exceptions and displays user-friendly error messages
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error - handle backend custom exceptions
        switch (error.status) {
          case 400: // ValidationError
            errorMessage = error.error?.error || 'Invalid request data';
            break;
          case 401: // AuthenticationError
            errorMessage = 'Authentication failed. Please check your Google Tasks credentials.';
            break;
          case 404: // NotFoundError
            errorMessage = error.error?.error || 'Resource not found';
            break;
          case 500: // Internal Server Error
            errorMessage = 'Server error. Please try again later.';
            break;
          case 502: // GoogleTasksError
            errorMessage = 'Failed to sync with Google Tasks. Please check your connection.';
            break;
          default:
            errorMessage = error.error?.error || `Error: ${error.statusText}`;
        }
      }

      // Display error message to user
      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
