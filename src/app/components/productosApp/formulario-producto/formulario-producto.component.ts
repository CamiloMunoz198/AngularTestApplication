import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ProductoInterface } from '../../../models/producto.interface';
import { ProductoGestionService } from '../../../services/producto-gestion.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulario-producto',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css'],
})
export class FormularioProductoComponent implements OnInit {
  productoFormGroup: FormGroup;
  private idActual: string;
  // 1. En la clase añade:
public cargando: boolean = false;
  // @Output() nuevoProductoOutPut= new EventEmitter<ProductoInterface>();
  constructor(
    private productoFormBuilder: FormBuilder,
    private alertService: SweetAlertService,
    private prodGesService: ProductoGestionService,
    private rutas: Router,
    private rutaActiva: ActivatedRoute
  ) {
    this.productoFormGroup = this.productoFormBuilder.group({
      Descripcion: [null, Validators.required],
      Valor: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const id = this.rutaActiva.snapshot.paramMap.get('Id');
    if (id) {
      const productoSeleccionado =
        this.prodGesService.ObtenerProductoSeleccionadoPorId(id);
      if (productoSeleccionado) {
        this.productoFormGroup.patchValue({
          Valor: productoSeleccionado.Valor,
          Descripcion: productoSeleccionado.Descripcion,
        });
        this.idActual = id;
      }
    }
  }
async  onAgregarProducto() {
    if (!this.validarFormulario()) {
      return;
    }
    this.cargando = true; // Bloqueamos el botón
    let productoAgregado: ProductoInterface = {
      Id: this.idActual != null ? this.idActual : (crypto as any).randomUUID(),
      Valor: this.productoFormGroup.get('Valor').value,
      Descripcion: this.productoFormGroup.get('Descripcion').value,
    };
    ///this.nuevoProductoOutPut.emit(productoAgregado);
    // ESPERAMOS a que el servicio termine la petición a Firebase
  const guardadoExitoso = await this.prodGesService.onAgregarProductoListService(productoAgregado);
  this.cargando = false; // Desbloquea el botón
  if (guardadoExitoso) {
    this.resetForm();
    this.volver();
  }
  }

  volver() {
    this.rutas.navigate(['/Productos']);
  }

  get obtenerIdActual(): string|null {
    return this.idActual;
  }

  async eliminarProducto() {
    if (!this.idActual) {
      return;
    }
    this.cargando = true; // bloquea el botón
    const productoEliminar: ProductoInterface = {
      Id: this.idActual,
      Valor: this.productoFormGroup.get('Valor').value,
      Descripcion: this.productoFormGroup.get('Descripcion').value,
    };
    const boolEliminado = await this.prodGesService.eliminarProductoService(
      productoEliminar
    );

    this.cargando = false; // Desbloquea el botón
    console.log('eliminado' , boolEliminado)

    if (boolEliminado) {
      
      this.resetForm();
      this.volver();
    }
  }

  validarFormulario(): Boolean {
    if (this.productoFormGroup.invalid) {
      this.productoFormGroup.markAllAsTouched();
      // 3. ¡CRUCIAL! Mostrar el modal de SweetAlert2
      this.alertService.mostrarError(
        '¡Error de Validación!',
        'Debes ingresar una descripcion y un valor valido'
      );
      return false;
    }
    return true;
  }
  resetForm() {
    this.productoFormGroup.reset(); //Limpia las variables del formulario
    this.idActual = null;
  }
}
