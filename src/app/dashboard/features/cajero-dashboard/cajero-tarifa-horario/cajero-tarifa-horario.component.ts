import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarifaHorarioService } from '../../../servicios/tarifa-horario.service';

@Component({
  selector: 'app-cajero-tarifa-horario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-tarifa-horario.component.html',
  styles: [],
})
export class CajeroTarifaHorarioComponent implements OnInit {
  tarifaActual: string = '';
  nuevaTarifa: string = '';
  mensajeConfirmacion: string | null = null;

  // Horarios laborales
  horarioLaboralesApertura: string = '';
  horarioLaboralesCierre: string = '';
  nuevoHorarioLaboralesApertura: string = '';
  nuevoHorarioLaboralesCierre: string = '';

  // Horarios fin de semana
  horarioFinesSemanaApertura: string = '';
  horarioFinesSemanaCierre: string = '';
  nuevoHorarioFinesSemanaApertura: string = '';
  nuevoHorarioFinesSemanaCierre: string = '';

  constructor(private tarifaHorarioService: TarifaHorarioService) {}

  async ngOnInit() {
    await this.obtenerTarifaActual();
    await this.obtenerHorarios();
  }

  // Obtener la tarifa actual
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

  // Obtener horarios
  async obtenerHorarios() {
    try {
      // Horarios laborales
      const laborales = await this.tarifaHorarioService.obtenerHorario('laborales');
      this.horarioLaboralesApertura = laborales.apertura;
      this.horarioLaboralesCierre = laborales.cierre;

      // Horarios fines de semana
      const finesSemana = await this.tarifaHorarioService.obtenerHorario('finDeSemana');
      this.horarioFinesSemanaApertura = finesSemana.apertura;
      this.horarioFinesSemanaCierre = finesSemana.cierre;
    } catch (error) {
      console.error('Error al obtener los horarios:', error);
    }
  }

  // Actualizar horario laborales
  async actualizarHorarioLaborales() {
    if (!this.nuevoHorarioLaboralesApertura || !this.nuevoHorarioLaboralesCierre) {
      this.mostrarMensajeConfirmacion('Por favor ingrese horarios laborales válidos.');
      return;
    }

    try {
      await this.tarifaHorarioService.actualizarHorario(
        'laborales',
        this.nuevoHorarioLaboralesApertura,
        this.nuevoHorarioLaboralesCierre
      );
      this.mostrarMensajeConfirmacion('Horario laborales actualizado correctamente.');
      this.horarioLaboralesApertura = this.nuevoHorarioLaboralesApertura;
      this.horarioLaboralesCierre = this.nuevoHorarioLaboralesCierre;
      this.nuevoHorarioLaboralesApertura = '';
      this.nuevoHorarioLaboralesCierre = '';
    } catch (error) {
      console.error('Error al actualizar horarios laborales:', error);
    }
  }

  // Actualizar horario fines de semana
  async actualizarHorarioFinesSemana() {
    if (!this.nuevoHorarioFinesSemanaApertura || !this.nuevoHorarioFinesSemanaCierre) {
      this.mostrarMensajeConfirmacion('Por favor ingrese horarios de fin de semana válidos.');
      return;
    }

    try {
      await this.tarifaHorarioService.actualizarHorario(
        'finDeSemana',
        this.nuevoHorarioFinesSemanaApertura,
        this.nuevoHorarioFinesSemanaCierre
      );
      this.mostrarMensajeConfirmacion('Horario de fines de semana actualizado correctamente.');
      this.horarioFinesSemanaApertura = this.nuevoHorarioFinesSemanaApertura;
      this.horarioFinesSemanaCierre = this.nuevoHorarioFinesSemanaCierre;
      this.nuevoHorarioFinesSemanaApertura = '';
      this.nuevoHorarioFinesSemanaCierre = '';
    } catch (error) {
      console.error('Error al actualizar horarios de fin de semana:', error);
    }
  }

  mostrarMensajeConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = null;
    }, 5000);
  }
}
