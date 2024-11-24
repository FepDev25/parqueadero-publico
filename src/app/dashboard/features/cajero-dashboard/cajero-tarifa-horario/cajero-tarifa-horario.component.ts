import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarifaHorarioService } from '../../../servicios/tarifa-horario.service';

@Component({
  selector: 'app-cajero-tarifa-horario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-tarifa-horario.component.html',
  styles: []
})
export class CajeroTarifaHorarioComponent implements OnInit {
  tarifaActual: string = ''; 
  nuevaTarifa: string = ''; 
  mensajeConfirmacion: string | null = null;

  constructor(private tarifaHorarioService: TarifaHorarioService) {}

  async ngOnInit() {
    await this.obtenerTarifaActual();
  }

  async obtenerTarifaActual() {
    try {
      const datos = await this.tarifaHorarioService.obtenerDatos();
      this.tarifaActual = datos.valor;
    } catch (error) {
      console.error('Error al obtener la tarifa actual:', error);
    }
  }

  async actualizarTarifa() {
    if (this.nuevaTarifa.trim() === '') {
      this.mostrarMensajeConfirmacion('Por favor ingrese una tarifa válida.');
      return;
    }

    try {
      await this.tarifaHorarioService.actualizarTarifa(this.nuevaTarifa);
      this.mostrarMensajeConfirmacion(`Tarifa actualizada a $${this.nuevaTarifa}.`);
      this.tarifaActual = this.nuevaTarifa;
      this.nuevaTarifa = '';
    } catch (error) {
      console.error('Error al actualizar la tarifa:', error);
      this.mostrarMensajeConfirmacion('Hubo un error al actualizar la tarifa.');
    }
  }

  mostrarMensajeConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = null;
    }, 5000);
  }
}
