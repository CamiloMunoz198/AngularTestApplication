import { Component, OnInit } from '@angular/core';
import { ItemPresupuestoInterface } from '../../../models/item-presupuesto-interface';
import { PresupuestoGestionService } from '../../../services/presupuesto-gestion.service';

@Component({
  selector: 'app-ingresos-presupuesto',
  templateUrl: './ingresos-presupuesto.component.html',
  styleUrls: ['./ingresos-presupuesto.component.css']
})
export class IngresosPresupuestoComponent implements OnInit {
  constructor(public preGestService:PresupuestoGestionService) { }

  ngOnInit() {
  }
}