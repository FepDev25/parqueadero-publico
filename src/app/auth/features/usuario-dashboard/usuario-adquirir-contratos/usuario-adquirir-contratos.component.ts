import { Component, OnInit } from '@angular/core';
import { UserServiceService, Contrato } from '../../servicios/user-service.service';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-adquirir-contratos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-adquirir-contratos.component.html',
})
export class UsuarioAdquirirContratosComponent implements OnInit {
  contrato: Partial<Contrato> = {
    duracionMeses: 0,
    fechaInicio: '',
  };

  contratos: Contrato[] = [];
  espaciosDisponibles: { id: number; ocupado: boolean }[] = [];
  espaciosDisponiblesFiltrados: { id: number; ocupado: boolean }[] = [];
  espaciosOcupadosFiltrados: { id: number; ocupado: boolean }[] = [];
  cedulaUsuario: string = '';
  espacioSeleccionado: number | null = null;
  rangoSeleccionado: string = '1-25';

  contratoSeleccionado: number | null = null;

  rangosEspacios: string[] = ['1-25', '26-50', '51-75', '76-100'];

  constructor(private userService: UserServiceService, private auth: Auth) {}

  async ngOnInit(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const userData = await this.userService.getUser(currentUser.uid);
      if (userData && userData.cedula) {
        this.cedulaUsuario = userData.cedula;

        this.userService.getContratosPorUsuario(this.cedulaUsuario).subscribe((contratos) => {
          this.contratos = contratos.filter((c) => c.usuarioId === this.cedulaUsuario);
        });

        this.cargarEspacios();
      } else {
        alert('No se encontró la cédula del usuario.');
      }
    }
  }

  cargarEspacios(): void {
    this.espaciosDisponibles = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      ocupado: Math.random() < 0.3, // 30% ocupados
    }));

    this.filtrarEspaciosPorRango();
  }

  filtrarEspaciosPorRango(): void {
    const [inicio, fin] = this.rangoSeleccionado.split('-').map(Number);

    this.espaciosDisponiblesFiltrados = this.espaciosDisponibles.filter(
      (espacio) => espacio.id >= inicio && espacio.id <= fin && !espacio.ocupado
    );

    this.espaciosOcupadosFiltrados = this.espaciosDisponibles.filter(
      (espacio) => espacio.id >= inicio && espacio.id <= fin && espacio.ocupado
    );
  }

  seleccionarEspacio(id: number): void {
    this.espacioSeleccionado = id;
    this.contrato.espacioId = id;
  }

  async adquirirContrato(): Promise<void> {
    if (!this.espacioSeleccionado) {
      alert('Por favor selecciona un espacio.');
      return;
    }

    const costoTotal = this.contrato.duracionMeses! * 50;
    const nuevoContrato: Contrato = {
      usuarioId: this.cedulaUsuario,
      espacioId: this.espacioSeleccionado,
      fechaInicio: this.contrato.fechaInicio!,
      duracionMeses: this.contrato.duracionMeses!,
      costoTotal,
    };

    await this.userService.crearContrato(nuevoContrato);
    alert('Contrato adquirido exitosamente.');
    this.contrato = { duracionMeses: 0, fechaInicio: '' };
    this.espacioSeleccionado = null;
    this.cargarEspacios();
  }

  mostrarInformacion(contrato: Contrato): void {
    this.contratoSeleccionado =
      this.contratoSeleccionado === contrato.espacioId ? null : contrato.espacioId;
  }

  calcularFechaFin(fechaInicio: string, duracionMeses: number): string {
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + duracionMeses);
    return fecha.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD
  }
}