import { Component, Input, OnInit } from '@angular/core';
import { ProductoInterface } from '../../../models/producto.interface';
import { ProductoGestionService } from '../../../services/producto-gestion.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() productoInput: ProductoInterface
  constructor(
    private prodGeService:ProductoGestionService
    ,private rutas:Router
    ) { }

  ngOnInit() {
  }

  enviarDetalleEmitter(){
this.prodGeService.detalleProductoEmitter.emit(this.productoInput);

  }

  editarProducto(id:string){
    this.rutas.navigate(['/EditarProducto',id]);
  }
}