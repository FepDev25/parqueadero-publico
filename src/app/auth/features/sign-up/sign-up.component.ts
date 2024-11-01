import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms' ;
import { emailValido, esRequerido, passwordLen } from '../../utils/validators';
import {CommonModule} from '@angular/common';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

interface FormularioCrearCuenta {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  nombre: FormControl<string | null>;
  fechaNacimiento: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.component.html'
})

export default class SignUpComponent {

  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

  esRequerido(field: 'email' | 'password' | 'nombre' | 'fechaNacimiento') {
    return esRequerido(field, this.form);
  }

  esEmailValido(){
    return emailValido(this.form);
  }

  esPasswordValida() {
    return passwordLen(this.form);
  }

  form = this._formBuilder.group<FormularioCrearCuenta>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.control('', [Validators.required, Validators.minLength(6)]),
    nombre: this._formBuilder.control('', [Validators.required]),
    fechaNacimiento: this._formBuilder.control('', [Validators.required])
  });
  

  async submit(){
    if (this.form.invalid) return;

    try {
      const { email, password, nombre, fechaNacimiento } = this.form.value;
      if (!email || !password || !nombre || !fechaNacimiento) return;
      
      const fechaNacimientoDate = new Date(fechaNacimiento);
      const fechaNacimientoTimestamp = Timestamp.fromDate(fechaNacimientoDate); 

      await this._authService.signUp({email, password, nombre, fechaNacimientoTimestamp});

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
