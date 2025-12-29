import {
  Compiler,
  CompilerFactory,
  COMPILER_OPTIONS,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { CalculadoraComponent } from './components/calculadoraApp/calculadora/calculadora.component';
import { ResultadoDetalleComponent } from './components/calculadoraApp/resultado-detalle/resultado-detalle.component';
import { ListaDetalleProductoComponent } from './components/productosApp/lista-detalle-producto/lista-detalle-producto.component';
import { FormularioProductoComponent } from './components/productosApp/formulario-producto/formulario-producto.component';
import { ProductoComponent } from './components/productosApp/producto/producto.component';
import { ListadoUsuariosComponent } from './components/usuariosApp/listado-usuarios/listado-usuarios.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PresupuestoComponent } from './components/presupuestoApp/presupuesto/presupuesto.component';
import { HeaderPresupuestoComponent } from './components/presupuestoApp/header-presupuesto/header-presupuesto.component';
import { EgresosPresupuestoComponent } from './components/presupuestoApp/egresos-presupuesto/egresos-presupuesto.component';
import { IngresosPresupuestoComponent } from './components/presupuestoApp/ingresos-presupuesto/ingresos-presupuesto.component';
import { FormularioPresupuestoComponent } from './components/presupuestoApp/formulario-presupuesto/formulario-presupuesto.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MenuNavegacionComponent } from './components/menuApp/menu-navegacion/menu-navegacion.component';
import { ErrorNavegacionComponent } from './components/error-navegacion/error-navegacion.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ControlUsuariosComponent } from "./components/controlUsuariosAPP/control-usuarios/control-usuarios.component";
import { DashboardCtlrUsuariosComponent } from './components/controlUsuariosAPP/dashboard-ctlr-usuarios/dashboard-ctlr-usuarios.component';
import { ClientesCtlrUsuariosComponent } from './components/controlUsuariosAPP/clientes-ctlr-usuarios/clientes-ctlr-usuarios.component';
import { FormClientesCtlrUsuariosComponent } from './components/controlUsuariosAPP/form-clientes-ctlr-usuarios/form-clientes-ctlr-usuarios.component';
import { FooterPageComponent } from './components/footerAPP/footer-page/footer-page.component';
import { HeaderClientesCtlrUsuaiosComponent } from './components/controlUsuariosAPP/header-clientes-ctlr-usuaios/header-clientes-ctlr-usuaios.component';
import { DashboardCtlrFormComponent } from './components/controlUsuariosAPP/dashboard-ctlr-form/dashboard-ctlr-form.component';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule,AppRoutingModule],
  declarations: [
    AppComponent,
    HelloComponent,
    CalculadoraComponent,
    ResultadoDetalleComponent,
    ListaDetalleProductoComponent,
    FormularioProductoComponent,
    ProductoComponent,
    ListadoUsuariosComponent,
    PresupuestoComponent,
    HeaderPresupuestoComponent,
    FormularioPresupuestoComponent,
    EgresosPresupuestoComponent,
    IngresosPresupuestoComponent,
    MenuNavegacionComponent,
    ErrorNavegacionComponent,
    LoginComponent,
    ControlUsuariosComponent,
    DashboardCtlrUsuariosComponent,
    ClientesCtlrUsuariosComponent,
    FormClientesCtlrUsuariosComponent,
    FooterPageComponent,
    HeaderClientesCtlrUsuaiosComponent,
    DashboardCtlrFormComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
})
export class AppModule {}

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
