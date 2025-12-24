import { Routes } from '@angular/router';
import { CalculadoraComponent } from './components/calculadoraApp/calculadora/calculadora.component';
import { PresupuestoComponent } from './components/presupuestoApp/presupuesto/presupuesto.component';
import { ListadoUsuariosComponent } from './components/usuariosApp/listado-usuarios/listado-usuarios.component';
import { ListaDetalleProductoComponent } from './components/productosApp/lista-detalle-producto/lista-detalle-producto.component';
import { FormularioProductoComponent } from './components/productosApp/formulario-producto/formulario-producto.component';
import { ErrorNavegacionComponent } from './components/error-navegacion/error-navegacion.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guard/auth.guard';
import { loginGuard } from './guard/login.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [loginGuard]},
  { path: 'Login', component: LoginComponent},
  { path: 'Calculadora', component: CalculadoraComponent, canActivate: [authGuard] },
  { path: 'Presupuesto', component: PresupuestoComponent,canActivate: [authGuard] },
  { path: 'Productos', component: ListaDetalleProductoComponent,canActivate: [authGuard] },
  { path: 'Usuarios', component: ListadoUsuariosComponent,canActivate: [authGuard] },
  {path:'Opciones',children:[
  { path: 'Calculadora', component: CalculadoraComponent,canActivate: [authGuard] },
  { path: 'Presupuesto', component: PresupuestoComponent,canActivate: [authGuard] },
  { path: 'Productos', component: ListaDetalleProductoComponent,canActivate: [authGuard] },
  { path: 'Usuarios', component: ListadoUsuariosComponent,canActivate: [authGuard] },
  ]},
  { path: 'AgregarProducto', component: FormularioProductoComponent,canActivate: [authGuard] },
  { path: 'EditarProducto/:Id', component: FormularioProductoComponent,canActivate: [authGuard] },
  {path :'**',component:ErrorNavegacionComponent}
];
