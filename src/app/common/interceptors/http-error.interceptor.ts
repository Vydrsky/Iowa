import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err.error);
          if(err.error?.errors !== undefined) {
            let message = '';
            Object.keys(err.error.errors).forEach((key) => {
              err.error.errors[key].forEach((msg: string) =>{
                message += msg + '\n';
              })
            });
            return throwError(message);
          }
          return throwError("Coś poszło nie tak, proszę spróbować później.");
        })
      );
  }

};
