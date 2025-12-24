import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { DataFireBaseRealTimeService } from '../../../services/data-fire-base-real-time.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-navegacion',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.css']
})
export class MenuNavegacionComponent implements OnInit {

  constructor(private fireBaseService: DataFireBaseRealTimeService
    ,private router:Router
    ) { }
  
  
  estaLogueado:boolean=false; //Maneja el estado de la barra de menu para saber si la muestra o no
  isMenuCollapsed = true; // Estado de la hamburguesa
  dropdownAbierto = false; // Estado del submenú Opciones

  private eRef = inject(ElementRef); // Para detectar clics fuera
  
  // ESCUCHA CLICS EN TODA LA PANTALLA
  @HostListener('document:click', ['$event'])
  clickOut(event: Event) {
    // Si el clic NO fue dentro de este componente (la navbar), cerramos todo
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.cerrarMenu();
    }
  }

  ngOnInit() {
    this.fireBaseService.obtenerToken().subscribe(token => {
      this.estaLogueado = !!token; // Convierte el string en boolean (true si hay token)
      console.log('login'+this.estaLogueado)
    });
  }

  onLogout() {
    this.fireBaseService.logOutService();
    this.router.navigate(['/Login']);
    this.cerrarMenu();
  }

  // Alterna la hamburguesa
  toggleHamburguesa() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    // Si cerramos la hamburguesa, también cerramos el dropdown por si estaba abierto
    if (this.isMenuCollapsed) this.dropdownAbierto = false;
  }

  // Alterna el dropdown de opciones
  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  // Se llama al hacer clic en cualquier link para limpiar la vista en móvil
  cerrarMenu() {
    this.isMenuCollapsed = true;
    this.dropdownAbierto = false;
  }

}