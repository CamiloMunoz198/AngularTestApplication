import { booleanAttribute, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginGestionService } from '../../services/login-gestion.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false, // <-- Cambia de true a false
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginFormGroup:FormGroup;
  loginObs$: Observable<boolean>;
  constructor(private loginFormBuilder:FormBuilder,
    private logGesSer:LoginGestionService
    ) {

    this.loginFormGroup=loginFormBuilder.group({
      usuarioFormControl:[null,Validators.required],
      passwordFormControl: [null,Validators.required]
    });
   }

  ngOnInit() {
  }

  async logguear(){
    const ValoresForm= this.loginFormGroup.value;
    const usuario:string=ValoresForm.usuarioFormControl;
    const pass:string=ValoresForm.passwordFormControl;
     const salida= await this.logGesSer.loginService(usuario,pass);
  }

}