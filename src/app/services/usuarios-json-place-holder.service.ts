import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn:"root"})
export class UsuariosJsonPlaceHolderService {

  private apiUrl:string='https://jsonplaceholder.typicode.com/users';
  constructor(private httpcli: HttpClient) { } 

  obtenerDatosUsuarioJsonPlaceHolder(): Observable<any>{
    return this.httpcli.get(this.apiUrl);    
  }
}