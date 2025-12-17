import { Injectable } from '@angular/core';
import { ItemPresupuestoInterface } from '../models/item-presupuesto-interface';
import { SweetAlertService } from './sweet-alert.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoGestionService {
 private presupuestoTotalService$ = new BehaviorSubject<number>(0);
 private ingresosTotalService$ = new BehaviorSubject<number>(0);
 private egresosTotalService$ = new BehaviorSubject<number>(0);
 private porcentajeTotalEgresosService$ = new BehaviorSubject<number>(0);

 get obtenerPresupuestoTotalService$():Observable<number> { return this.presupuestoTotalService$.asObservable(); }
 get obteneringresosTotalService$():Observable<number> { return this.ingresosTotalService$.asObservable(); }
 get obteneregresosTotalService$():Observable<number> { return this.egresosTotalService$.asObservable(); }
 get obtenerporcentajeTotalEgresosService$():Observable<number> { return this.porcentajeTotalEgresosService$.asObservable(); }

  listIngresosService$= new BehaviorSubject<ItemPresupuestoInterface[]>([]);
  listEgresosService$= new BehaviorSubject<ItemPresupuestoInterface[]>([]);
  get obtenerListaIngresosService$() { return this.listIngresosService$.asObservable(); }
  get obtenerListaEgresosService$() { return this.listEgresosService$.asObservable(); }

  constructor(private alertService:SweetAlertService) {
    this.onObtenerLocalStorage();
  }

  private onGuardarLocalStorage() {
    // Convertimos los arreglos a string JSON para guardarlos
    localStorage.setItem('ingresos_app', JSON.stringify(this.listIngresosService$.value));
    localStorage.setItem('egresos_app', JSON.stringify(this.listEgresosService$.value));
  }

  private onObtenerLocalStorage() {
    const ingresosStorage = localStorage.getItem('ingresos_app');
    const egresosStorage = localStorage.getItem('egresos_app');

    // Si existen datos, los transformamos de texto a objetos. Si no, iniciamos vacíos [].
    this.listIngresosService$.next(ingresosStorage ? JSON.parse(ingresosStorage) : [])
    this.listEgresosService$.next(egresosStorage ? JSON.parse(egresosStorage) : [])

    // Importante: Calcular totales iniciales basados en lo que cargamos
    this.onActualizarValores();
  }
  private onCalcularPresupuestoService(ingresos:number,egresos:number) {
    const presupuestoTotal= ingresos-egresos;
     this.presupuestoTotalService$.next(presupuestoTotal);
  }
  private onCalcularPorcentajeEgresosService(ingresos:number,egresos:number) {
    const porcentajeTotalEgresosService = 
    ingresos>0?
      egresos / ingresos
      :0;
      this.porcentajeTotalEgresosService$.next(porcentajeTotalEgresosService);
  }
 
  private onAgregarIngresoService(itemNuevo: ItemPresupuestoInterface) {
    this.listIngresosService$.next([...this.listIngresosService$.value, itemNuevo]);//... copia del arreglo y se agrega item nuevo
    console.log("entreaqui");
  }

  private onAgregarEgresoService(itemNuevo: ItemPresupuestoInterface) {
    this.listEgresosService$.next([...this.listEgresosService$.value, itemNuevo]);
  }

  private onSumarLista(listItem: ItemPresupuestoInterface[]): number {
    let result = 0;
    listItem.forEach((item) => {
      result += item.ValorInterface;
    });
    return result;
  }

  private onCargarIngresos(ingresos:number) {
     this.ingresosTotalService$.next(ingresos);
  }
  private onCargarEgresos(egresos:number) {
    this.egresosTotalService$.next(egresos);
  }

  private onActualizarValores() {
    const ingresos=this.onSumarLista(this.listIngresosService$.value);
    const egresos= this.onSumarLista(this.listEgresosService$.value);
    this.onCargarIngresos(ingresos);
    this.onCargarEgresos(egresos);
    this.onCalcularPresupuestoService(ingresos,egresos);
    this.onCalcularPorcentajeEgresosService(ingresos,egresos);
    this.onGuardarLocalStorage();
  }

  onAgregarItemService(itemNuevo: ItemPresupuestoInterface){
    let OperacionMensaje="";
    if(itemNuevo.OperacionInterface=="ingreso"){
      this.onAgregarIngresoService(itemNuevo);
      OperacionMensaje="¡Ingreso Agregado!";
    }
    else if(itemNuevo.OperacionInterface=="egreso"){
      this.onAgregarEgresoService(itemNuevo);
      OperacionMensaje="Egreso Agregado!";
    }
    else{
      this.alertService.mostrarError(
        'Operacion Invalida',
        'Esta Operacion No Esta Disponible'
      );
      return;
    }
    this.onActualizarValores();
    this.alertService.mostrarExito(
       OperacionMensaje,
      `Descripcion : ${itemNuevo.DescripcionInterface} Valor : ${itemNuevo.ValorInterface}`
    );
  }

  onEgresoParcialService(egresoValor:number):number{
    const ingresosTotal=this.ingresosTotalService$.value;
    let egresoParcial=
    ingresosTotal>0?
    egresoValor/ingresosTotal:
    0
    ;
    return egresoParcial;
  }

  private onQuitarIngresoService(itemEliminar: ItemPresupuestoInterface) {
   const listIngresos= this.listIngresosService$.value.filter(item => item !== itemEliminar);
    this.listIngresosService$.next(listIngresos);
  }

  private onQuitarEgresoService(itemEliminar: ItemPresupuestoInterface) {
   const listEgresos= this.listEgresosService$.value.filter(item => item !== itemEliminar);
    this.listEgresosService$.next(listEgresos);
  }

 async onQuitarItemService(itemEliminar: ItemPresupuestoInterface){
    const confirmar = await this.alertService.confirmarEliminacion(
      '¿Eliminar registro?',
      `¿Deseas quitar "${itemEliminar.DescripcionInterface}"?`
    );

    if (confirmar) {
    let OperacionMensaje="";
    if(itemEliminar.OperacionInterface=="ingreso"){
      this.onQuitarIngresoService(itemEliminar);
      OperacionMensaje="¡Ingreso Eliminado!";
    }
    else if(itemEliminar.OperacionInterface=="egreso"){
      this.onQuitarEgresoService(itemEliminar);
      OperacionMensaje="Egreso Eliminado!";
    }
    else{
      this.alertService.mostrarError(
        'Operacion Invalida',
        'Esta Operacion No Esta Disponible'
      );
      return;
    }
    this.onActualizarValores();
    this.alertService.mostrarExito(
       OperacionMensaje,
      `Descripcion : ${itemEliminar.DescripcionInterface} Valor : ${itemEliminar.ValorInterface}`
    );
  }
}
}
