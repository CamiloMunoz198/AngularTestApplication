import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultado-detalle',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './resultado-detalle.component.html',
  styleUrls: ['./resultado-detalle.component.css']
})
export class ResultadoDetalleComponent implements OnInit {

  MensajeResultado: string="";
  constructor() { }

  ngOnInit() {
  }

  onCargarMensajeResultado(mensaje:string){
    this.MensajeResultado=mensaje;
  }

}