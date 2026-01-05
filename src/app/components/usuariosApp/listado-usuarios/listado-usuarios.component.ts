import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuariosJsonPlaceHolderService } from '../../../services/usuarios-json-place-holder.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-listado-usuarios',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css'],
})
export class ListadoUsuariosComponent implements OnInit, OnDestroy{
  usuariosList: any[] = [];
  constructor(private usuarioSevice: UsuariosJsonPlaceHolderService) {}

  cargando: boolean = true; // Inicia en true para mostrar el loader de inmediato
  loaderVisible: boolean = true; // Controla la opacidad (CSS)

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>(); // Para limpieza de memoria
  ngOnInit() {
    this.usuarioSevice
      .obtenerDatosUsuarioJsonPlaceHolder()
      .pipe(takeUntil(this.destroy$))
      .subscribe({        
         next: (dataUsuariosApi) => {  
          this.usuariosList = dataUsuariosApi; 

        // 2. Esperamos los 0.3s del CSS para quitarlo del DOM
        setTimeout(() => {
            // 1. Iniciamos el desvanecimiento de salida
        this.loaderVisible = false;
          this.cargando = false;
        }, 300);
        },
        error: (err) => {
          console.error("Error cargando clientes", err);
          this.cargando = false;
        }
      });
  }
}
