import { EventEmitter, Injectable } from "@angular/core";
import { SweetAlertService } from "./sweet-alert.service";
import { DataFireBaseRealTimeService } from "./data-fire-base-real-time.service";
import { BehaviorSubject, Observable } from "rxjs";
import { ClienteCtrlInterface } from "../models/cliente-ctrl-interface";

@Injectable({ providedIn: "root" })
export class ClienteGestionService {
  private clienteListService$ = new BehaviorSubject<ClienteCtrlInterface[]>([]);
  public obtenerListaClientes$: Observable<ClienteCtrlInterface[]> =
    this.clienteListService$.asObservable();

  private saldoTotalService$ = new BehaviorSubject<number>(0);
  obtenerSaldoTotal$: Observable<number> =
    this.saldoTotalService$.asObservable();

  private clientesTotalService$ = new BehaviorSubject<number>(0);
  obtenerClientesTotal$: Observable<number> =
    this.clientesTotalService$.asObservable();

  constructor(
    private alertService: SweetAlertService,
    private datosClienteBD: DataFireBaseRealTimeService
  ) {}

  onAgregarClienteListService(cliente: ClienteCtrlInterface): Promise<boolean> {
    return new Promise((resolve) => {
      this.datosClienteBD.guardarOActualizarCliente(cliente).subscribe({
        next: () => {
          // Refrescamos la lista desde la base de datos
          this.cargarClienteDb();

          if (cliente.Id) {
            this.alertService.mostrarExito(
              "Cliente Actualizado!",
              `Descripcion: ${cliente.Nombres} 
              Valor: ${cliente.Saldo}`
            );
          } else {
            this.alertService.mostrarExito(
              "¡Cliente Agregado!",
              `Descripcion: ${cliente.Nombres} 
              Valor: ${cliente.Saldo}`
            );
          }
          resolve(true);
        },
        error: (err) => {
          // Manejo de errores si Firebase falla
          this.alertService.mostrarError(
            "Error de Sincronización",
            "No se pudo guardar el cliente en la nube."
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

  async eliminarClienteService(
    cliente: ClienteCtrlInterface
  ): Promise<boolean> {
    const confirmar = await this.alertService.confirmarEliminacion(
      "¿Eliminar registro?",
      `¿Deseas quitar "${cliente.Nombres}"?`
    );

    if (!confirmar) {
      return false; //Early Return
    }

    return new Promise((resolve) => {
      this.datosClienteBD.eliminarCliente(cliente.Id).subscribe({
        next: () => {
          // Filtramos localmente y notificamos
          this.cargarClienteDb();
          this.alertService
            .mostrarExito("¡Cliente Eliminado!", cliente.Nombres);
          resolve(true);
        },
        error: (err) => {
          this.alertService.mostrarError(
            "Error",
            "No se pudo eliminar de la base de datos."
          );
          resolve(false); // IMPORTANTE: Resolvemos como false para que el componente sepa que falló
        },
      });
    });
  }

  cargarClienteDb() {
    this.datosClienteBD.getClientes().subscribe({
      next: (clientesMapeados) => {
        // Actualizamos el flujo de datos (Subject)
        this.clienteListService$.next(clientesMapeados);
        let saldoTotal = 0;
        let clientesTotal = 0;
        if (clientesMapeados) {
          this.clienteListService$.value.forEach((cliente) => {
            saldoTotal += cliente.Saldo;
          });
          clientesTotal = this.clienteListService$.value.length;
        }
        this.saldoTotalService$.next(saldoTotal);
        this.clientesTotalService$.next(clientesTotal);
      },
      error: (err) => {
        this.alertService.mostrarError(
          "Error",
          "No se pudo sincronizar con la nube"
        );
      },
    });
  }
}
