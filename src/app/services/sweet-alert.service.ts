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
  mostrarError(title: string, text: string): void {
    Swal.fire({
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
  mostrarExito(title:string, text: string): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      timer: 3000, // Se cierra automáticamente después de 3 segundos
      showConfirmButton: false,
    });
  }
}
