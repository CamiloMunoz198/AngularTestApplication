import {OperacionesPresupuestoEnum} from "../dataEnum/operaciones-presupuesto.enum";


export interface ItemPresupuestoInterface {
  Id:string,
  DescripcionInterface:string,
  ValorInterface:number,
  OperacionInterface:OperacionesPresupuestoEnum,
}