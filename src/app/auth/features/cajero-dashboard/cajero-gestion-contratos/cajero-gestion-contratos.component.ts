import { Component, OnInit } from '@angular/core';
import { UserServiceService, Contrato, User } from '../../servicios/user-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cajero-gestion-contratos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-gestion-contratos.component.html',
})
export class CajeroGestionContratosComponent implements OnInit {
  usuarios: User[] = []; // Lista de usuarios
  contratos: Contrato[] = []; // Lista de contratos
  contratosFiltrados: Contrato[] = []; // Contratos filtrados por usuario
  usuarioSeleccionado: string = ''; // Usuario seleccionado (cédula)

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    // Cargar todos los usuarios
    this.userService.getAllUsers().subscribe((usuarios: User[]) => {
      this.usuarios = usuarios;
    });

    // Cargar todos los contratos
    this.userService.getAllContratos().subscribe((contratos: Contrato[]) => {
      this.contratos = contratos;
      this.contratosFiltrados = contratos; // Inicialmente, mostrar todos
    });
  }

  filtrarContratos(): void {
    if (this.usuarioSeleccionado) {
      // Filtrar contratos por usuario seleccionado
      this.contratosFiltrados = this.contratos.filter(
        (contrato) => contrato.usuarioId === this.usuarioSeleccionado
      );
    } else {
      // Si no hay usuario seleccionado, mostrar todos
      this.contratosFiltrados = this.contratos;
    }
  }

  async eliminarContrato(contratoId: string): Promise<void> {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este contrato?');
    if (confirmacion) {
      await this.userService.eliminarContrato(contratoId);
      alert('Contrato eliminado exitosamente.');

      // Actualizar la lista de contratos
      this.contratos = this.contratos.filter((contrato) => contrato.id !== contratoId);
      this.filtrarContratos(); // Actualizar contratos filtrados
    }
  }

  calcularFechaFin(fechaInicio: string, duracionMeses: number): string {
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + duracionMeses);
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }
}