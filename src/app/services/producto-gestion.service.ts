import { EventEmitter, Injectable } from '@angular/core';
import { ProductoInterface } from '../models/producto.interface';
import { SweetAlertService } from './sweet-alert.service';

@Injectable(
  {providedIn: 'root'}
)
export class ProductoGestionService {
  ProductoListService: ProductoInterface[] = [
    { Descripcion: 'Product 1', Valor: 100 },
    { Descripcion: 'Product 2', Valor: 200 },
  ];  

  detalleProductoEmitter= new EventEmitter<ProductoInterface>();

  detalleProductoNormal :ProductoInterface

   constructor(private alertService:SweetAlertService) {}

   onAgregarProductoListService (producto: ProductoInterface){
    this.ProductoListService.push(producto);
  }
}
