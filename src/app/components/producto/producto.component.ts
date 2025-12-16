import { Component, Input, OnInit } from '@angular/core';
import { ProductoInterface } from '../../models/producto.interface';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() productoInput: ProductoInterface
  constructor() { }

  ngOnInit() {
  }

}