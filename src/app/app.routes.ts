import { Routes } from '@angular/router';
import { CalculadoraComponent } from './components/calculadoraApp/calculadora/calculadora.component';
import { PresupuestoComponent } from './components/presupuestoApp/presupuesto/presupuesto.component';
import { ListadoUsuariosComponent } from './components/usuariosApp/listado-usuarios/listado-usuarios.component';
import { ListaDetalleProductoComponent } from './components/productosApp/lista-detalle-producto/lista-detalle-producto.component';

export const routes: Routes = [
  { path: '', component: PresupuestoComponent },
  { path: 'Calculadora', component: CalculadoraComponent },
  { path: 'Presupuesto', component: PresupuestoComponent },
  { path: 'Productos', component: ListaDetalleProductoComponent },
  { path: 'Usuarios', component: ListadoUsuariosComponent },
  {path:'Opciones',children:[
  { path: 'Calculadora', component: CalculadoraComponent },
  { path: 'Presupuesto', component: PresupuestoComponent },
  { path: 'Productos', component: ListaDetalleProductoComponent },
  { path: 'Usuarios', component: ListadoUsuariosComponent },
  ]}
];
