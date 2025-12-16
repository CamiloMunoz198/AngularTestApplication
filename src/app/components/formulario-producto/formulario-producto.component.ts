import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { ProductoComponent } from '../producto/producto.component';
import { ProductoInterface } from '../../models/producto.interface';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css'],
})
export class FormularioProductoComponent implements OnInit {
  productoFormGroup: FormGroup;
  @Output() nuevoProductoOutPut= new EventEmitter<ProductoInterface>();
  constructor(
    private productoFormBuilder: FormBuilder,
    private alertService: SweetAlertService
  ) {
    this.productoFormGroup = productoFormBuilder.group({
      Descripcion: [null, Validators.required],
      Valor: [null, Validators.required],
    });
  }

  ngOnInit() {}
  onAgregarProducto() {
    const valoresForm = this.productoFormGroup.value;
    let Desc = valoresForm.Descripcion;
    let Val = valoresForm.Valor;
    if (this.productoFormGroup.invalid || Desc == '' || Val <= 0) {
      this.productoFormGroup.markAllAsTouched;
      // 3. ¡CRUCIAL! Mostrar el modal de SweetAlert2
      this.alertService.mostrarError(
        '¡Error de Validación!',
        'Debes ingresar una descripcion y un valor valido'
      );
      return;
    }
    let productoAgregado: ProductoInterface = {
      Valor:Val,
      Descripcion:Desc
    };
    this.nuevoProductoOutPut.emit(productoAgregado);
    this.alertService.mostrarExito(
      '¡Producto Agregado!',
      `Descripcion: ${Desc} 
      Valor: ${Val}`
    );
  }
}
