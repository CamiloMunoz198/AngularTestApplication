import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-presupuesto',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}