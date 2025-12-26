import { Component } from '@angular/core';
import { ClienteGestionService } from 'src/app/services/cliente-gestion-service';

@Component({
  selector: 'app-clientes-ctlr-usuarios',
  standalone: false,
  templateUrl: './clientes-ctlr-usuarios.component.html',
  styleUrl: './clientes-ctlr-usuarios.component.css'
})
export class ClientesCtlrUsuariosComponent {

  constructor(public clienteGesService: ClienteGestionService) { }

  ngOnInit(): void {
    this.clienteGesService.cargarClienteDb();
  }
}
