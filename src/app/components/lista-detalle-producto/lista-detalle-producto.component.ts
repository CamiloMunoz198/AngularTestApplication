import { Component, OnInit } from '@angular/core';
import { ProductoInterface } from '../../models/producto.interface';

@Component({
  selector: 'app-lista-detalle-producto',
  templateUrl: './lista-detalle-producto.component.html',
  styleUrls: ['./lista-detalle-producto.component.css'],
})
export class ListaDetalleProductoComponent implements OnInit {
  ProductoList: ProductoInterface[] = [
    { Descripcion: 'Product 1', Valor: 100 },
    { Descripcion: 'Product 2', Valor: 200 },
  ];
  constructor() {}

  ngOnInit() {}

  onAgregarProductoList (Evento: ProductoInterface){
    this.ProductoList.push(Evento);
  }
}
