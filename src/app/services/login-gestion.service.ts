import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataFireBaseRealTimeService } from './data-fire-base-real-time.service';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGestionService {
  constructor(
    private dataFireBase: DataFireBaseRealTimeService,
    private alertService: SweetAlertService,
    private rutanueva: Router,
  ) {}

 async loginService(email: string, pass: string) {

    const loginState= await this.dataFireBase.loginService(email,pass);
    if (loginState) {
        console.log('¡Login exitoso!', loginState);
        // El token viene en res.idToken
        this.alertService.mostrarExito('Bienvenido', 'Has iniciado sesión');
        this.rutanueva.navigate(['/Productos']);
      }
      else{
        this.alertService.mostrarError('Error', 'Credenciales incorrectas.');
      }
  }
}
