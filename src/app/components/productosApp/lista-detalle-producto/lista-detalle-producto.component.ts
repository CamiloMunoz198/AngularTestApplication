import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../../models/producto.interface';
import { ProductoGestionService } from '../../../services/producto-gestion.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-detalle-producto',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './lista-detalle-producto.component.html',
  styleUrls: ['./lista-detalle-producto.component.css'],
})
export class ListaDetalleProductoComponent implements OnInit {
  ProductoList$: Observable<ProductoInterface[]>;
  constructor(
    private prodGestSer: ProductoGestionService,
    private alertService: SweetAlertService,
    private rutas:Router,
  ) {
this.ProductoList$=this.prodGestSer.obtenerListaProductos$;

    prodGestSer.detalleProductoEmitter.subscribe(
      (productoEmitido: ProductoInterface) => {
        this.alertService.mostrarExito(
          '¡Producto Emitido!',
          `Descripcion es: ${productoEmitido.Descripcion} Valor es: ${productoEmitido.Valor}`
        );
      }
    );
  }

  ngOnInit() {
   
    this.prodGestSer.cargarProductosDb();

  }

  agregagarProducto(){
this.rutas.navigate(['/AgregarProducto']);

  }
}
