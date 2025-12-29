import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteGestionService } from 'src/app/services/cliente-gestion-service';
import { FormClientesCtlrUsuariosComponent } from '../form-clientes-ctlr-usuarios/form-clientes-ctlr-usuarios.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-clientes-ctlr-usuarios',
  standalone: false,
  templateUrl: './clientes-ctlr-usuarios.component.html',
  styleUrl: './clientes-ctlr-usuarios.component.css'
})
export class ClientesCtlrUsuariosComponent implements OnInit, OnDestroy{


cargando: boolean = true; // Inicia en true para mostrar el loader de inmediato

@ViewChild(FormClientesCtlrUsuariosComponent) formularioCliente!: FormClientesCtlrUsuariosComponent;
private destroy$ = new Subject<void>(); // Para limpieza de memoria

  constructor(public clienteGesService: ClienteGestionService,private rutas: Router) { }

  ngOnInit(): void {
    // 1. Llamamos a la carga de datos
    this.clienteGesService.cargarClienteDb();

    // 2. Escuchamos la lista. Cuando emite datos, apagamos el loader
    this.clienteGesService.obtenerListaClientes$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          // Si los datos llegaron (aunque sea un array vacío), quitamos el loader
          this.cargando = false;
        },
        error: (err) => {
          console.error("Error cargando clientes", err);
          this.cargando = false;
        }
      });
  }

  editarCliente(id: string) {
    this.rutas.navigate(['/ControlUsuarios/EditarCliente',id]);    
  }

  resetearFormulario() {
    this.formularioCliente.resetForm();
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
