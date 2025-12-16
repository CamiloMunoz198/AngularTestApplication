import { Component, Input, OnInit } from '@angular/core';
import { ProductoInterface } from '../../../models/producto.interface';
import { ProductoGestionService } from '../../../services/producto-gestion.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() productoInput: ProductoInterface
  constructor(private prodGeService:ProductoGestionService) { }

  ngOnInit() {
  }

  enviarDetalleEmitter(){
this.prodGeService.detalleProductoEmitter.emit(this.productoInput);

  }
}