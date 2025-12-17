import { Component, OnInit } from '@angular/core';
import { PresupuestoGestionService } from '../../../services/presupuesto-gestion.service';

@Component({
  selector: 'app-header-presupuesto',
  templateUrl: './header-presupuesto.component.html',
  styleUrls: ['./header-presupuesto.component.css'],
})
export class HeaderPresupuestoComponent implements OnInit {
  constructor(public preGesService: PresupuestoGestionService) {}

  ngOnInit() {}

}
