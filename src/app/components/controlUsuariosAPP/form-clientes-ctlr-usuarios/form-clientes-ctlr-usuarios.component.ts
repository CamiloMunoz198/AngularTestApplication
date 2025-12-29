import { Component } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { min } from 'rxjs';
import { ClienteCtrlInterface } from 'src/app/models/cliente-ctrl-interface';
import { ClienteGestionService } from 'src/app/services/cliente-gestion-service';
declare var bootstrap: any;

@Component({
  selector: 'app-form-clientes-ctlr-usuarios',
  standalone: false,
  templateUrl: './form-clientes-ctlr-usuarios.component.html',
  styleUrl: './form-clientes-ctlr-usuarios.component.css'
})
export class FormClientesCtlrUsuariosComponent {

clienteFormGroup:FormGroup;
private idActual: string;
public cargando: boolean = false;

  constructor(private clienteFormBuilder: FormBuilder, private rutaActiva: ActivatedRoute,
     private cliGesService:ClienteGestionService,private rutas:Router) { 

    this.clienteFormGroup = this.clienteFormBuilder.group({
      NombresFormControl: [null,[Validators.required,Validators.minLength(2)]],
      ApellidosFormControl: [null,[Validators.required,Validators.minLength(2)]],
      EmailFormControl: [null,[Validators.required,Validators.email]],
      SaldoFormControl: [null,[Validators.required,Validators.min(0)]]
    });
  }

ngOnInit() {
  const id = this.rutaActiva.snapshot.paramMap.get('Id');
          console.log("Id cargado en el formulario:", id);
    if (id) {
      const clienteSeleccionado =
        this.cliGesService.ObtenerClienteSeleccionadoPorId(id);
      if (clienteSeleccionado) {
        this.clienteFormGroup.patchValue({
          NombresFormControl: clienteSeleccionado.Nombres,
          ApellidosFormControl: clienteSeleccionado.Apellidos,
          EmailFormControl: clienteSeleccionado.Email,
          SaldoFormControl: clienteSeleccionado.Saldo
        });
        this.idActual = id;
        console.log("Cliente cargado en el formulario:", clienteSeleccionado);
      }
    }
  }

   get obtenerIdActual(): string|null {
    return this.idActual;
  }

    resetForm() {
    this.clienteFormGroup.reset(); //Limpia las variables del formulario
    this.idActual = null;
  }

    volver() {
    this.rutas.navigate(['/ControlUsuarios']);
  }

  async guardarCliente() {
  if (this.clienteFormGroup.invalid) {
    // Esto hace que todos los mensajes rojos aparezcan de golpe
    this.clienteFormGroup.markAllAsTouched();
    return;
  }
  
 this.cargando = true; // Bloqueamos el botón
     let clienteAgregado: ClienteCtrlInterface = {
       Id: this.idActual,
       Nombres: this.clienteFormGroup.get('NombresFormControl').value,
       Apellidos: this.clienteFormGroup.get('ApellidosFormControl').value,
       Email: this.clienteFormGroup.get('EmailFormControl').value,
       Saldo: this.clienteFormGroup.get('SaldoFormControl').value
     };
     // ESPERAMOS a que el servicio termine la petición a Firebase
   const guardadoExitoso = await this.cliGesService.onAgregarClienteListService(clienteAgregado);
   this.cargando = false; // Desbloquea el botón
   if (guardadoExitoso) {
    this.closeModal();
     // Esperamos un pequeño delay para que la animación termine antes de navegar
    setTimeout(() => {
        this.resetForm();
        this.volver();
    }, 300);
   }
}

closeModal() {
  // Cerramos el modal usando la API de Bootstrap
    const modalElement = document.getElementById('agregarClienteModal');    
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
      return;
    }
    this.volver();
}

  // Función centralizada para validar campos
campoEsInvalido(nombreCampo: string): boolean {
  const campo = this.clienteFormGroup.get(nombreCampo);
  return !!(campo?.invalid && campo?.touched);
}

// Función para obtener el tipo de error (opcional, para mensajes específicos)
obtenerMensajeError(nombreCampo: string): string {
  const campo = this.clienteFormGroup.get(nombreCampo);
  if (campo?.hasError('required')) return 'Este campo es obligatorio';
  if (campo?.hasError('minlength')) return `Mínimo ${campo.errors?.['minlength'].requiredLength} caracteres`;
  if (campo?.hasError('email')) return 'El formato de correo no es válido';
  if (campo?.hasError('min')) return 'El saldo no puede ser negativo';
  return '';
}


}
