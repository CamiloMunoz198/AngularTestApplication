import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemPresupuestoInterface } from '../../../models/item-presupuesto-interface';
import { PresupuestoGestionService } from '../../../services/presupuesto-gestion.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import {
  listaOperaciones,
  OperationPresupuestoData,
} from '../../../data/operation-presupuesto-data';

@Component({
  selector: 'app-formulario-presupuesto',
  templateUrl: './formulario-presupuesto.component.html',
  styleUrls: ['./formulario-presupuesto.component.css'],
})
export class FormularioPresupuestoComponent implements OnInit {
  itemFormGroup: FormGroup;
  constructor(
    private itemFormBuilder: FormBuilder,
    private preGestService: PresupuestoGestionService,
    private alertService: SweetAlertService
  ) {
    this.itemFormGroup = itemFormBuilder.group({
      DescripcionFormControl: [null, Validators.required],
      ValorFormControl: [null, [Validators.required, Validators.min(1)]],
      OperacionFormControl: [null, Validators.required], // Valor inicial
    });
  }

  ngOnInit() {}
  onAnadirItem() {
    let valoresForm = this.itemFormGroup.value;
    let descripcion = valoresForm.DescripcionFormControl;
    let valor = valoresForm.ValorFormControl;
    let operacion = valoresForm.OperacionFormControl;

    if (this.itemFormGroup.invalid) {
      this.itemFormGroup.markAllAsTouched();
      // 3. ¡CRUCIAL! Mostrar el modal de SweetAlert2
      this.alertService.mostrarError(
        '¡Error de Validación!',
        'Debes ingresar una descripcion un valor valido y una Operacion Valida'
      );
      return;
    }
    let itemNuevo: ItemPresupuestoInterface = {
      ValorInterface: valor,
      DescripcionInterface: descripcion,
      OperacionInterface: operacion,
    };
    this.preGestService.onAgregarItemService(itemNuevo);
    this.itemFormGroup.reset({
      OperacionFormControl: operacion, // Mantiene el último signo seleccionado (+ o -)
      DescripcionFormControl: null,
      ValorFormControl: null
    });
  }

  get operaciones(): OperationPresupuestoData[] {
    let OperacionesDisponibles: OperationPresupuestoData[] = listaOperaciones;
    return OperacionesDisponibles;
  }
}
