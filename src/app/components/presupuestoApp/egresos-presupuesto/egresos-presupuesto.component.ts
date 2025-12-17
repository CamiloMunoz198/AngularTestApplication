import { Component, OnInit } from '@angular/core';
import { ItemPresupuestoInterface } from '../../../models/item-presupuesto-interface';
import { PresupuestoGestionService } from '../../../services/presupuesto-gestion.service';

@Component({
  selector: 'app-egresos-presupuesto',
  templateUrl: './egresos-presupuesto.component.html',
  styleUrls: ['./egresos-presupuesto.component.css']
})
export class EgresosPresupuestoComponent implements OnInit {

  constructor(public preGestService:PresupuestoGestionService) { }

  ngOnInit() {
  }

   onEgresoParcial(egresoValor:number):number{
    return this.preGestService.onEgresoParcialService(egresoValor);
  }

  onQuitarItem(itemEliminar:ItemPresupuestoInterface){
    this.preGestService.onQuitarItemService(itemEliminar);
  }

}