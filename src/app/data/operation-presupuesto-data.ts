export interface OperationPresupuestoData {
  valor: string; // El valor real de la operación (+, -)
  nombre: string; // El nombre legible para el usuario (+, -)
}

export const listaOperaciones: OperationPresupuestoData[] = [
  { valor: '+', nombre: 'ingreso' },
  { valor: '-', nombre: 'egreso' },
];