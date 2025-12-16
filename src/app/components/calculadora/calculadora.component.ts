import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Intenta esta (la más común si el archivo está en una subcarpeta de 'components')
import { SweetAlertService } from '../../services/sweet-alert.service';
import { listaOperaciones, OperationMock } from '../../data/operation-mock';
import { ResultadoDetalleComponent } from '../resultado-detalle/resultado-detalle.component';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css'],
})
export class CalculadoraComponent implements OnInit {
  resultado: number = 0;
  calculadoraFormGroup: FormGroup;
  operacionesDisponibles: OperationMock[] = listaOperaciones;
  @ViewChild(ResultadoDetalleComponent)
  componenteResultadoDetalle: ResultadoDetalleComponent;
  constructor(
    private calculadoraFormBuilder: FormBuilder,
    private alertService: SweetAlertService
  ) {
    this.calculadoraFormGroup = this.calculadoraFormBuilder.group({
      Campo1: [null, Validators.required],
      Campo2: [null, Validators.required],
      Operacion: [null, Validators.required],
    });
  }

  ngOnInit() {}

  addCampos() {
    if (this.calculadoraFormGroup.invalid) {
      console.log('Campos Invalidos');
      this.calculadoraFormGroup.markAllAsTouched;
      // 3. ¡CRUCIAL! Mostrar el modal de SweetAlert2
      this.alertService.mostrarError(
        '¡Error de Validación!',
        'Debes ingresar un valor numérico en ambos campos para realizar el cálculo.'
      );

      return;
    }
    const valores = this.calculadoraFormGroup.value;
    let numero1 = valores.Campo1;
    let numero2 = valores.Campo2;
    let operacion = valores.Operacion;
    switch (operacion) {
      case '+':
        this.resultado = numero1 + numero2;
        this.componenteResultadoDetalle.MensajeResultado = 'Se sumo';
        break;
      case '-':
        this.resultado = numero1 - numero2;
        this.componenteResultadoDetalle.MensajeResultado = 'Se Resto';
        break;
      case '*':
        this.resultado = numero1 * numero2;
        this.componenteResultadoDetalle.MensajeResultado = 'Se Multiplico';
        break;
      case '/':
        this.resultado = numero1 / numero2;
        this.componenteResultadoDetalle.MensajeResultado = 'Se Dividio';
        break;
      default:
        this.alertService.mostrarError(
          '¡Error de Operacion!',
          'El programa no esta detectando una operacion valida: ' + operacion
        );
        return;
    }

    // 3. (Opcional) Llamada al servicio para mostrar éxito después del cálculo
    this.alertService.mostrarExito(
      '¡Proceso Ejecutado!',
      `La suma total es: ${this.resultado}`
    );
  }
}
