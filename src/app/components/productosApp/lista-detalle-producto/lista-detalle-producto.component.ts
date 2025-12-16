import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../../models/producto.interface';
import { ProductoGestionService } from '../../../services/producto-gestion.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-lista-detalle-producto',
  templateUrl: './lista-detalle-producto.component.html',
  styleUrls: ['./lista-detalle-producto.component.css'],
})
export class ListaDetalleProductoComponent implements OnInit {
  ProductoList: ProductoInterface[];
  constructor(
    private prodGestSer: ProductoGestionService,
    private alertService: SweetAlertService
  ) {
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
    this.ProductoList = this.prodGestSer.ProductoListService;
  }

  // onAgregarProductoList (Evento: ProductoInterface){
  //   this.prodGestSer.onAgregarProductoListService(Evento);
  // }
}
