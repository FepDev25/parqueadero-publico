import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms' ;
import { emailValido, esRequerido, passwordLen } from '../../utils/validators';
import {CommonModule} from '@angular/common';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink, RouterModule } from '@angular/router';

interface FormularioCrearCuenta{
  email : FormControl<string | null>;
  password : FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export default class SignInComponent {

  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

  esRequerido(field : 'email' | 'password'){
    return esRequerido(field, this.form);
  }

  esEmailValido(){
    return emailValido(this.form);
  }

  esPasswordValida() {
    return passwordLen(this.form);
  }

  form = this._formBuilder.group<FormularioCrearCuenta>({
    email : this._formBuilder.control('', [
      Validators.required,
      Validators.email
    ]),
    password : this._formBuilder.control('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  async submit(){
    if (this.form.invalid) return;

    try {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      if (!email || !password) return;

      

      toast.success("Usuario creado correctamente.")
      this._router.navigateByUrl('');
    } catch (error) { 
      toast.error("Error al crear el usuario.")
    }
  }

  async signInGoogle(){
    try {
      await this._authService.signInWithGoogle();
      toast.success("Usuario creado correctamente.")
    } catch (error) {
      toast.error("Error al crear el usuario.")
    }
  }

}
