import { Component, OnInit } from '@angular/core';
import { UsuariosJsonPlaceHolderService } from '../../../services/usuarios-json-place-holder.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css'],
})
export class ListadoUsuariosComponent implements OnInit {
  usuariosList: any[] = [];
  constructor(private usuarioSevice: UsuariosJsonPlaceHolderService) {}

  ngOnInit() {
    this.usuarioSevice
      .obtenerDatosUsuarioJsonPlaceHolder()
      .subscribe((dataUsuariosApi) => {
        this.usuariosList = dataUsuariosApi;
      });
  }
}
