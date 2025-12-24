import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('session_token');

  if (token) {
    // Si ya está logueado, lo mandamos a la página principal de la App
    router.navigate(['/Productos']); 
    return false; // Bloqueamos el acceso al login
  } else {
    // Si no hay token, lo dejamos entrar al login
    return true;
  }
};