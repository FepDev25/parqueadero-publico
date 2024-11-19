import { FormGroup } from "@angular/forms";

export const esRequerido = (field : 'email' | 'password' | 'nombre' | 'fechaNacimiento' | 'role' | 'cedula', form : FormGroup) => {
    const control = form.get(field);
    return control && control.touched && control.hasError('required');
}

export const emailValido = (form : FormGroup) => {
    const control = form.get('email');
    return control && control.touched && control.hasError('email');
}


export const passwordLen = (form : FormGroup) => {
    const control = form.get('password');
    return control && control.touched && control.errors && control.errors['minlength']
}
