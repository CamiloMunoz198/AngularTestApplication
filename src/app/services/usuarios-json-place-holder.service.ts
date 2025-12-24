import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoInterface } from '../models/producto.interface';

@Injectable({providedIn:"root"})
export class UsuariosJsonPlaceHolderService {

  private apiUrl:string='https://jsonplaceholder.typicode.com/';
  constructor(private httpcli: HttpClient) { } 

  obtenerDatosUsuarioJsonPlaceHolder(): Observable<any>{
    return this.httpcli.get(this.apiUrl+'users');    
  }
}