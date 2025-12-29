import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import { ProductoInterface } from '../models/producto.interface';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ClienteCtrlInterface } from '../models/cliente-ctrl-interface';


@Injectable({ providedIn: 'root' })
export class DataFireBaseRealTimeService {
  urlFireBase: string = environment.urlFireBase;
  urlGooleIdentity: string = environment.urlGooleIdentity;
  apiKeyFireBase: string = environment.apiKeyFireBase;

  urlApiFireStoreClientes = environment.urlFireStore+'/Clientes';//Para acceder a la coleccion Clientes
  urlRunQuery = environment.urlFireStore+':runQuery'; // Para correr Queries
  urlFireBaseKeyLogin = this.urlGooleIdentity + this.apiKeyFireBase;
  minutosExpiracion = environment.expirationSessionMinutes;
  private token$ = new BehaviorSubject<string>('');
  obtenerToken():Observable<string>{return this.token$.asObservable();}


private timerInactividad: any;
private readonly MINUTOS_EXPIRACION = this.minutosExpiracion; // <--- Configura aquí el tiempo

resetearRelojInactividad() {
  if (this.timerInactividad) {
    clearTimeout(this.timerInactividad);
  }

  this.timerInactividad = setTimeout(() => {
    console.warn('Sesión expirada por inactividad');
    this.logOutService();
    // Opcional: Recargar la página para asegurar que el Guard actúe
    window.location.reload(); 
  }, this.MINUTOS_EXPIRACION * 60 * 1000);
}

  constructor(private peticionesHttp: HttpClient,
    private router:Router) {
    const tokenPersistente = localStorage.getItem('session_token');
  if (tokenPersistente) {
    this.token$.next(tokenPersistente);
  }
  }
  



 private loginFireBase(email: string, pass: string): Observable<any> {
    const authData = {
      email: email,
      password: pass,
      returnSecureToken: true,
    };
    return this.peticionesHttp.post(this.urlFireBaseKeyLogin, authData);
  }

  obtenerProductos(): Observable<ProductoInterface[]> {
    return this.peticionesHttp
      .get(this.urlFireBase + 'dataProductos.json')//token se inyecta por interceptor
      .pipe(
        map((data: any) => {
          const productos: ProductoInterface[] = [];

          if (data) {
            Object.keys(data).forEach((key) => {
              const p = data[key];
              productos.push({
                Id: key, // La llave es el ID (ej: PRODUCTO_ID_APP_1)
                Descripcion: p.Descripcion,
                Valor: p.Precio, // Mapeamos 'Precio' a tu propiedad 'Valor'
              });
            });
          }
          return productos;
        })
      );
  }

  // Usamos PUT para que el ID del nodo sea igual al Id de tu interfaz
  guardarOActualizarProducto(producto: ProductoInterface): Observable<any> {
    const objetoFirebase = {
      Descripcion: producto.Descripcion,
      Precio: producto.Valor, // Mapeo de Valor a Precio para Firebase
    };
    return this.peticionesHttp.put(
      `${this.urlFireBase}dataProductos/${producto.Id}.json`,
      objetoFirebase
    );
  }

  eliminarProducto(id: string): Observable<any> {
    return this.peticionesHttp.delete(
      `${this.urlFireBase}dataProductos/${id}.json`
    );
  }

  loginService(email: string, pass: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.loginFireBase(email, pass).subscribe({
        next: (res) => {
          this.token$.next(res.idToken);
          localStorage.setItem('session_token', res.idToken);
          resolve(true);
        },

        error: (err) => {
          resolve(false);
        },
      });
    });
  }

  logOutService(){
    // 1. Limpia el timer para que no se sigan creando hilos en memoria
  if (this.timerInactividad) {clearTimeout(this.timerInactividad)};
  //Limpieza Sesion LocalStorage
    localStorage.removeItem('session_token');
    //Limpiesa Token en Observable
    this.token$.next('');
    //Log para ver en consola
    console.log('entro al logout');
    //Redireccion
    this.router.navigate(['/Login']);
    
  }

  //FireStore Methods Placeholder
  // 1. OBTENER TODOS LOS CLIENTES
  getClientes(): Observable<ClienteCtrlInterface[]> {

    const body = {
    structuredQuery: {
      from: [{ collectionId: 'Clientes' }]
      // ,orderBy: [
      //   {
      //     field: { fieldPath: 'createdDate' },
      //     direction: 'DESCENDING' // O 'ASCENDING'
      //   }
      // ]
    }
  };

    return this.peticionesHttp.post(this.urlRunQuery, body).pipe(
    map((res: any[]) => {
      // Nota: runQuery devuelve un array de objetos { document: { fields: ... } }
      return res.filter(item => item.document).map(item => {
        const doc = item.document;
        return {
            Id: doc.name.split('/').pop(), // Extrae el ID del final de la ruta
            Nombres: doc.fields.Nombres?.stringValue || '',
            Apellidos: doc.fields.Apellidos?.stringValue || '',
            Email: doc.fields.Email?.stringValue || '',
            Saldo: Number(doc.fields.Saldo?.doubleValue || doc.fields.Saldo?.integerValue || 0),
            // LEEMOS EL CAMPO DE SISTEMA AQUÍ:
            creadoEn: new Date(doc.createTime).getTime()
          };
        })// ORDENAMOS POR EL TIEMPO DE SISTEMA (Descendente)
        .sort((a, b) => b.creadoEn - a.creadoEn);
      })
    );
  }

  // 2. GUARDAR O ACTUALIZAR
  // Firestore REST usa POST para crear (ID automático) 
  // o PATCH para actualizar un documento específico
  guardarOActualizarCliente(cliente: ClienteCtrlInterface): Observable<any> {
    const bodyFirestore = {
      fields: {
        Nombres: { stringValue: cliente.Nombres },
        Apellidos: { stringValue: cliente.Apellidos },
        Email: { stringValue: cliente.Email },
        Saldo: { doubleValue: cliente.Saldo }
      }
    };

    if (cliente.Id) {
      // ACTUALIZAR (PATCH)
      // Se debe usar updateMask para indicar qué campos cambian
      const params = '?updateMask.fieldPaths=Nombres&updateMask.fieldPaths=Apellidos&updateMask.fieldPaths=Email&updateMask.fieldPaths=Saldo';
      return this.peticionesHttp.patch(`${this.urlApiFireStoreClientes}/${cliente.Id}${params}`, bodyFirestore);
    } else {
      // CREAR NUEVO (POST)
      return this.peticionesHttp.post(this.urlApiFireStoreClientes, bodyFirestore);
    }
  }

  // 3. ELIMINAR
  eliminarCliente(id: string): Observable<any> {
    return this.peticionesHttp.delete(`${this.urlApiFireStoreClientes}/${id}`);
  }


}
