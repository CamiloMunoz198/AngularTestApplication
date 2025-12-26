
import { EventEmitter, Injectable } from '@angular/core';
import { SweetAlertService } from './sweet-alert.service';
import { DataFireBaseRealTimeService } from './data-fire-base-real-time.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClienteCtrlInterface } from '../models/cliente-ctrl-interface';

@Injectable({ providedIn: 'root' })

export class ClienteGestionService {

  private clienteListService$ = new BehaviorSubject<ClienteCtrlInterface[]>([]);
  public obtenerListaClientes$: Observable<ClienteCtrlInterface[]> =
    this.clienteListService$.asObservable();

      constructor(
    private alertService: SweetAlertService,
    private datosClienteBD: DataFireBaseRealTimeService
  ) {}

   onAgregarClienteListService(cliente: ClienteCtrlInterface):Promise<boolean> {
    return new Promise((resolve) => {
    this.datosClienteBD.guardarOActualizarCliente(cliente).subscribe({
      next: () => {
        const clienteExistente = this.ObtenerClienteSeleccionadoPorId(
          cliente.Id
        );
        const listaActual=[...this.clienteListService$.value]

        if (clienteExistente) {
          const indiceClienteExistente = listaActual.findIndex(
            (p) => p.Id == clienteExistente.Id
          );
          listaActual[indiceClienteExistente] = cliente;

          this.alertService.mostrarExito(
            'Cliente Actualizado!',
            `Descripcion: ${cliente.Nombres} 
        Valor: ${cliente.Saldo}`
          );
        } else {
           listaActual.push(cliente);
          this.alertService.mostrarExito(
            '¡Cliente Agregado!',
            `Descripcion: ${cliente.Nombres} 
      Valor: ${cliente.Saldo}`
          );
        }
        // Emitimos la nueva lista inmediatamente
        this.clienteListService$.next(listaActual);
        resolve(true);
      },
      error: (err) => {
        // Manejo de errores si Firebase falla
        this.alertService.mostrarError(
          'Error de Sincronización',
          'No se pudo guardar el producto en la nube.'
        );  
        resolve(false); 
},
    });
  });
  }

  ObtenerClienteSeleccionadoPorId(id: string): ClienteCtrlInterface {
    const listaActual = this.clienteListService$.value;
    return listaActual.find((cliente) => cliente.Id === id);
  }

  async eliminarClienteService(cliente: ClienteCtrlInterface): Promise<boolean> {
    const confirmar = await this.alertService.confirmarEliminacion(
      '¿Eliminar registro?',
      `¿Deseas quitar "${cliente.Nombres}"?`
    );

    if (!confirmar) {
      return false; //Early Return
    }

    return new Promise((resolve) => {
      this.datosClienteBD.eliminarProducto(cliente.Id).subscribe({
        next: () => {
          // Filtramos localmente y notificamos
          const listaActualizada = this.clienteListService$.value.filter(p => p.Id !== cliente.Id);
          this.clienteListService$.next(listaActualizada);

          this.alertService.mostrarExito('¡Cliente Eliminado!', cliente.Nombres);
          resolve(true); 
        },
        error: (err) => {
          this.alertService.mostrarError('Error', 'No se pudo eliminar de la base de datos.');
          resolve(false); // IMPORTANTE: Resolvemos como false para que el componente sepa que falló
        }
      });
    });
  }

  cargarClienteDb() {
    this.datosClienteBD.getClientes().subscribe({
      next: (clientesMapeados) => {
        // Actualizamos el flujo de datos (Subject)
        this.clienteListService$.next(clientesMapeados);
      },
      error: (err) => {
        this.alertService.mostrarError(
          'Error',
          'No se pudo sincronizar con la nube'
        );
      },
    });
  }

}