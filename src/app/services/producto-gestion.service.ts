import { EventEmitter, Injectable } from '@angular/core';
import { ProductoInterface } from '../models/producto.interface';
import { SweetAlertService } from './sweet-alert.service';
import { DataFireBaseRealTimeService } from './data-fire-base-real-time.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductoGestionService {
  private productoListService$ = new BehaviorSubject<ProductoInterface[]>([]);
  public obtenerListaProductos$: Observable<ProductoInterface[]> =
    this.productoListService$.asObservable();

  detalleProductoEmitter = new EventEmitter<ProductoInterface>();

  detalleProductoNormal: ProductoInterface;

  constructor(
    private alertService: SweetAlertService,
    private datosProductosBD: DataFireBaseRealTimeService
  ) {}

  onAgregarProductoListService(producto: ProductoInterface):Promise<boolean> {
    return new Promise((resolve) => {
    this.datosProductosBD.guardarOActualizarProducto(producto).subscribe({
      next: () => {
        const productoExistente = this.ObtenerProductoSeleccionadoPorId(
          producto.Id
        );
        const listaActual=[...this.productoListService$.value]

        if (productoExistente) {
          const indiceProductoExistente = listaActual.findIndex(
            (p) => p.Id == productoExistente.Id
          );
          listaActual[indiceProductoExistente] = producto;

          this.alertService.mostrarExito(
            '¡Producto Actualizado!',
            `Descripcion: ${producto.Descripcion} 
        Valor: ${producto.Valor}`
          );
        } else {
           listaActual.push(producto);
          this.alertService.mostrarExito(
            '¡Producto Agregado!',
            `Descripcion: ${producto.Descripcion} 
      Valor: ${producto.Valor}`
          );
        }
        // Emitimos la nueva lista inmediatamente
        this.productoListService$.next(listaActual);
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

  ObtenerProductoSeleccionadoPorId(id: string): ProductoInterface {
    const listaActual = this.productoListService$.value;
    return listaActual.find((producto) => producto.Id === id);
  }

  async eliminarProductoService(producto: ProductoInterface): Promise<boolean> {
    const confirmar = await this.alertService.confirmarEliminacion(
      '¿Eliminar registro?',
      `¿Deseas quitar "${producto.Descripcion}"?`
    );

    if (!confirmar) {
      return false; //Early Return
    }

    return new Promise((resolve) => {
      this.datosProductosBD.eliminarProducto(producto.Id).subscribe({
        next: () => {
          // Filtramos localmente y notificamos
          const listaActualizada = this.productoListService$.value.filter(p => p.Id !== producto.Id);
          this.productoListService$.next(listaActualizada);

          this.alertService.mostrarExito('¡Producto Eliminado!', producto.Descripcion);
          resolve(true); 
        },
        error: (err) => {
          this.alertService.mostrarError('Error', 'No se pudo eliminar de la base de datos.');
          resolve(false); // IMPORTANTE: Resolvemos como false para que el componente sepa que falló
        }
      });
    });
  }

  cargarProductosDb() {
    this.datosProductosBD.obtenerProductos().subscribe({
      next: (productosMapeados) => {
        // Actualizamos el flujo de datos (Subject)
        this.productoListService$.next(productosMapeados);
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
