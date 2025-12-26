import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from '../services/sweet-alert.service';
import { DataFireBaseRealTimeService } from '../services/data-fire-base-real-time.service';
import { environment } from 'src/environments/environment';


@Injectable({providedIn:'root'})
export class AuthInterceptor implements HttpInterceptor {

  
  constructor  (private alertService:SweetAlertService,private dataFareBaseService:DataFireBaseRealTimeService)
  {}
  private readonly URL_FIREBASE = environment.urlFireBase;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('session_token');
    let request = req;

    if (token && req.url.startsWith(this.URL_FIREBASE)) {
      request = req.clone({
        params: req.params.set('auth', token)
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.startsWith(this.URL_FIREBASE)) {
          
          if (error.status === 401 || error.status === 403 || error.status === 404) {
            // 1. Limpiamos el token inmediatamente
            this.dataFareBaseService.logOutService();

            // 2. Mostramos la alerta al usuario
            this.alertService.mostrarError(
              'Sesión Expirada', 
              'Tu tiempo de conexión ha terminado por seguridad. Por favor, ingresa de nuevo.'
            ).then(() => {
              // 3. Redirigimos al login SOLO después de que el usuario cierre la alerta
              this.dataFareBaseService.logOutService();
            });
          }
        }
        return throwError(() => error);
      })
    );
  }
}