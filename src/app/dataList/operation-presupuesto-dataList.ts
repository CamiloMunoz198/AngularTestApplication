import { OperacionesPresupuestoEnum } from "../dataEnum/operaciones-presupuesto.enum";

export interface OperationPresupuestoDataList {
  valor: string; // El valor real de la operación (+, -)
  nombre: string; // El nombre legible para el usuario (+, -)
}

export const listaOperaciones: OperationPresupuestoDataList[] = [
  { valor: OperacionesPresupuestoEnum.Ingreso, nombre: '+' },
  { valor: OperacionesPresupuestoEnum.Egreso, nombre: '-' },
];