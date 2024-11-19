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

  mensajeError: string | null = null;

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

  async submit() {
    if (this.form.invalid) {
      this.mostrarMensajeError("Formulario inválido.");
      return;
    };
  
    try {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      
      
      if (!email || !password) return;  
  
      const userData = await this._authService.signIn(email, password);
  
      if (userData.role === 'cajero') {
        this._router.navigateByUrl('auth/cajero-dashboard');
      } else if (userData.role === 'usuario') {
        this._router.navigateByUrl('auth/usuario-dashboard');
      } else {
        throw new Error("Rol no reconocido.");
      }
  
      toast.success("Inicio de sesión exitoso.");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  }
  

  async signInGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success("Inicio de sesión con Google exitoso.");
  
      // Obtener el usuario actual para verificar su rol
      const currentUser = await this._authService.getCurrentUser();
      if (currentUser?.role === 'cajero') {
        this._router.navigateByUrl('auth/cajero-dashboard');
      } else if (currentUser?.role === 'usuario') {
        this._router.navigateByUrl('auth/usuario-dashboard');
      } else {
        throw new Error("Rol no reconocido.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      toast.error("Error al iniciar sesión con Google.");
    }
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje; // Establece el mensaje de error
    setTimeout(() => {
      this.mensajeError = null; // Oculta el mensaje después de 5 segundos
    }, 5000);
  }
  

}
