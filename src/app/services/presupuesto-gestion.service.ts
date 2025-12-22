import { Injectable } from '@angular/core';
import { ItemPresupuestoInterface } from '../models/item-presupuesto-interface';
import { SweetAlertService } from './sweet-alert.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperacionesPresupuestoEnum } from '../dataEnum/operaciones-presupuesto.enum';

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

  private listIngresosService$= new BehaviorSubject<ItemPresupuestoInterface[]>([]);
  private listEgresosService$= new BehaviorSubject<ItemPresupuestoInterface[]>([]);
  get obtenerListaIngresosService$():Observable<ItemPresupuestoInterface[]>  { return this.listIngresosService$.asObservable(); }
  get obtenerListaEgresosService$():Observable<ItemPresupuestoInterface[]>  { return this.listEgresosService$.asObservable(); }

  constructor(private alertService:SweetAlertService) {
    this.obtenerLocalStorage();
  }

  private guardarLocalStorage() {
    // Convertimos los arreglos a string JSON para guardarlos
    localStorage.setItem('ingresos_app', JSON.stringify(this.listIngresosService$.value));
    localStorage.setItem('egresos_app', JSON.stringify(this.listEgresosService$.value));
  }

  private obtenerLocalStorage() {
    const ingresosStorage = localStorage.getItem('ingresos_app');
    const egresosStorage = localStorage.getItem('egresos_app');

    // Si existen datos, los transformamos de texto a objetos. Si no, iniciamos vacíos [].
    this.listIngresosService$.next(ingresosStorage ? JSON.parse(ingresosStorage) as ItemPresupuestoInterface[] : [])
    this.listEgresosService$.next(egresosStorage ? JSON.parse(egresosStorage) as ItemPresupuestoInterface[] : [])

    // Importante: Calcular totales iniciales basados en lo que cargamos
    this.actualizarValores();
  }
  private calcularPresupuestoService(ingresos:number,egresos:number) {
    const presupuestoTotal= ingresos-egresos;
     this.presupuestoTotalService$.next(presupuestoTotal);
  }
  private calcularPorcentajeEgresosService(ingresos:number,egresos:number) {
    const porcentajeTotalEgresosService = 
    ingresos>0?
      egresos / ingresos
      :0;
      this.porcentajeTotalEgresosService$.next(porcentajeTotalEgresosService);
  }
 
  private agregarIngresoService(itemNuevo: ItemPresupuestoInterface) {
    this.listIngresosService$.next([...this.listIngresosService$.value, itemNuevo]);//... copia del arreglo y se agrega item nuevo
  }

  private agregarEgresoService(itemNuevo: ItemPresupuestoInterface) {
    this.listEgresosService$.next([...this.listEgresosService$.value, itemNuevo]);
  }

  private sumarLista(listItem: ItemPresupuestoInterface[]): number {
    let result = 0;
    listItem.forEach((item) => {
      result += item.ValorInterface;
    });
    return result;
  }

  private cargarIngresos(ingresos:number) {
     this.ingresosTotalService$.next(ingresos);
  }
  private cargarEgresos(egresos:number) {
    this.egresosTotalService$.next(egresos);
  }

  private actualizarValores() {
    const ingresos=this.sumarLista(this.listIngresosService$.value);
    const egresos= this.sumarLista(this.listEgresosService$.value);
    this.cargarIngresos(ingresos);
    this.cargarEgresos(egresos);
    this.calcularPresupuestoService(ingresos,egresos);
    this.calcularPorcentajeEgresosService(ingresos,egresos);
    this.guardarLocalStorage();
  }

  agregarItemService(itemNuevo: ItemPresupuestoInterface){
    let OperacionMensaje="";
    if(itemNuevo.OperacionInterface==OperacionesPresupuestoEnum.Ingreso){
      this.agregarIngresoService(itemNuevo);
      OperacionMensaje="¡Ingreso Agregado!";
    }
    else if(itemNuevo.OperacionInterface==OperacionesPresupuestoEnum.Egreso){
      this.agregarEgresoService(itemNuevo);
      OperacionMensaje="Egreso Agregado!";
    }
    else{
      this.alertService.mostrarError(
        'Operacion Invalida',
        'Esta Operacion No Esta Disponible'
      );
      return;
    }
    this.actualizarValores();
    this.alertService.mostrarExito(
       OperacionMensaje,
      `Descripcion : ${itemNuevo.DescripcionInterface} Valor : ${itemNuevo.ValorInterface}`
    );
  }

  egresoParcialService(egresoValor:number):number{
    let egresoParcial=
    this.ingresosTotalService$.value>0?
    egresoValor/this.ingresosTotalService$.value:
    0
    ;
    return egresoParcial;
  }

  private quitarIngresoService(itemEliminar: ItemPresupuestoInterface) {
   const listIngresos= this.listIngresosService$.value.filter(item => item.Id !== itemEliminar.Id);
    this.listIngresosService$.next(listIngresos);
  }

  private quitarEgresoService(itemEliminar: ItemPresupuestoInterface) {
   const listEgresos= this.listEgresosService$.value.filter(item => item.Id !== itemEliminar.Id);
    this.listEgresosService$.next(listEgresos);
  }

 async quitarItemService(itemEliminar: ItemPresupuestoInterface){
    const confirmar = await this.alertService.confirmarEliminacion(
      '¿Eliminar registro?',
      `¿Deseas quitar "${itemEliminar.DescripcionInterface}"?`
    );

    if (confirmar) {
    let OperacionMensaje="";
    if(itemEliminar.OperacionInterface==OperacionesPresupuestoEnum.Ingreso){
      this.quitarIngresoService(itemEliminar);
      OperacionMensaje="¡Ingreso Eliminado!";
    }
    else if(itemEliminar.OperacionInterface==OperacionesPresupuestoEnum.Egreso){
      this.quitarEgresoService(itemEliminar);
      OperacionMensaje="Egreso Eliminado!";
    }
    else{
      this.alertService.mostrarError(
        'Operacion Invalida',
        'Esta Operacion No Esta Disponible'
      );
      return;
    }
    this.actualizarValores();
    this.alertService.mostrarExito(
       OperacionMensaje,
      `Descripcion : ${itemEliminar.DescripcionInterface} Valor : ${itemEliminar.ValorInterface}`
    );
  }
}
}
