import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'; // Importamos SweetAlert y SweetAlertIcon

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor() {}

  /**
   * Muestra un modal de error personalizado para la validación de la calculadora.
   * @param title El título del modal.
   * @param text El cuerpo del mensaje.
   */
  mostrarError(title: string, text: string): Promise<any> {
   return Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#dc3545', // Rojo
      toast: false,
    });
  }

  /**
   * (Opcional) Muestra un modal de éxito para el cálculo.
   * @param text El resultado del cálculo.
   */
  mostrarExito(title:string, text: string): Promise<any> {
   return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 5000, // Se cierra automáticamente después de 3 segundos
      showConfirmButton: true,
    });
  }

  mostrarAdvertencia(title: string, text: string): Promise<any> {
   return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#ffc107', // Amarillo Warning de Bootstrap
      toast: false,
    });
  }

  async confirmarEliminacion(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    return result.isConfirmed;
  }
}
