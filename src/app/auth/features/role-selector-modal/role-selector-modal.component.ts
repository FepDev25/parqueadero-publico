import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-selector-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './role-selector-modal.component.html',
  styles: [],
})
export class RoleSelectorModalComponent {
  @Output() cedulaCompleted = new EventEmitter<string>(); // Emitir cédula al completar
  cedula: string = ''; // Modelo para la cédula

  completeRegistration() {
    if (this.cedula.trim() === '') {
      alert('Por favor, ingresa una cédula válida.');
      return;
    }
    this.cedulaCompleted.emit(this.cedula); // Emitir el valor de la cédula
  }
}
