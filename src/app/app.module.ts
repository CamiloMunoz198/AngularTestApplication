import { Compiler, CompilerFactory, COMPILER_OPTIONS, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { CalculadoraComponent } from './components/calculadora/calculadora.component';
import { ResultadoDetalleComponent } from './components/resultado-detalle/resultado-detalle.component';
import { ListaDetalleProductoComponent } from './components/lista-detalle-producto/lista-detalle-producto.component';
import { FormularioProductoComponent } from './components/formulario-producto/formulario-producto.component';
import { ProductoComponent } from './components/producto/producto.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule,ReactiveFormsModule ],
  declarations: [ AppComponent, HelloComponent,CalculadoraComponent,ResultadoDetalleComponent,ListaDetalleProductoComponent,FormularioProductoComponent,ProductoComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    { provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS] },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] }
  ]
})
export class AppModule { }

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
