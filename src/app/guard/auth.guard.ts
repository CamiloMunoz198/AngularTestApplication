import { inject } from '@angular/core';
import { CanActivateFn,Router} from '@angular/router';
import { SweetAlertService } from '../services/sweet-alert.service';
import { DataFireBaseRealTimeService } from '../services/data-fire-base-real-time.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const alertService = inject(SweetAlertService);
  const dataFareBaseService = inject(DataFireBaseRealTimeService);
  
  // Revisamos si existe el token en el almacenamiento local
  const token = localStorage.getItem('session_token');

  if (token) {
    // Si hay token, permitimos el acceso
    return true;
  } else {
    // Si no hay token, bloqueamos y avisamos
    alertService.mostrarError(
      'Acceso Denegado', 
      'Debes iniciar sesión para ver esta sección.'
    ).then(
()=>
      {dataFareBaseService.logOutService();}
    );
    
    router.navigate(['/Login']);
    return false;
  }
};
