import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValido, esRequerido, passwordLen } from '../../utils/validators';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';

interface FormularioCrearCuenta {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  nombre: FormControl<string | null>;
  fechaNacimiento: FormControl<string | null>;
  role: FormControl<string | null>;
  cedula: FormControl<string | null>; 
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.component.html'
})
export default class SignUpComponent {

  mensajeError: string | null = null;

  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

  esRequerido(field: 'email' | 'password' | 'nombre' | 'fechaNacimiento' | 'role' | 'cedula') {
    return esRequerido(field, this.form);
  }

  esEmailValido() {
    return emailValido(this.form);
  }

  esPasswordValida() {
    return passwordLen(this.form);
  }

  
  form = this._formBuilder.group<FormularioCrearCuenta>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.control('', [Validators.required, Validators.minLength(6)]),
    nombre: this._formBuilder.control('', [Validators.required]),
    fechaNacimiento: this._formBuilder.control('', [Validators.required]),
    role: this._formBuilder.control('', []),
    cedula: this._formBuilder.control('', [Validators.required]),
  });
  
  async submit() {
    if (this.form.invalid) {
      this.mostrarMensajeError("Formulario inválido.");
      console.log("Formulario inválido:", this.form.value);
      return;
    }
  
    try {
      const { email, password, nombre, fechaNacimiento, role, cedula } = this.form.value;
      if (!email || !password || !nombre || !fechaNacimiento) {
        this.mostrarMensajeError("Formulario inválido.");
        console.log("Campos faltantes en el formulario:", this.form.value);
        return;
      }
  
      const fechaNacimientoFormatted = fechaNacimiento;

      await this._authService.signUp({
        email,
        password,
        nombre,
        fechaNacimiento: fechaNacimientoFormatted,
        role: role || 'usuario',
        cedula: cedula || '',
      });

      
      const currentUser = await this._authService.getCurrentUser();
      toast.success("Usuario creado correctamente.");
      if (currentUser?.role === 'cajero') {
        this._router.navigateByUrl('/auth/cajero-dashboard');
      } else if (currentUser?.role === 'usuario') {
        this._router.navigateByUrl('/auth/usuario-dashboard');
      }
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
      toast.error("Error al crear el usuario.");
    }
  }
  
  async signInGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success("Usuario autenticado correctamente.");

      const currentUser = await this._authService.getCurrentUser();
      if (currentUser?.role === 'cajero') {
        this._router.navigateByUrl('/auth/cajero-dashboard');
      } else if (currentUser?.role === 'usuario') {
        this._router.navigateByUrl('/auth/usuario-dashboard');
      }
    } catch (error) {
      toast.error("Error al autenticarse con Google.");
    }
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 5000);
  }

}
