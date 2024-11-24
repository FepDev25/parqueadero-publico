import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, Contrato, UserServiceService } from '../../../servicios/user-service.service';
import { TarifaHorarioService } from '../../../servicios/tarifa-horario.service';

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
  selectedContrato: Contrato | null = null;
  tarifaBase: number = 0;

  constructor(
    private userService: UserServiceService,
    private tarifaHorarioService: TarifaHorarioService
  ) {}

  ngOnInit(): void {
    // Cargar usuarios y contratos
    this.userService.getAllUsers().subscribe((usuarios: User[]) => {
      this.usuarios = usuarios;
    });

    this.userService.getAllContratos().subscribe((contratos: Contrato[]) => {
      this.contratos = contratos;
      this.contratosFiltrados = contratos; // Mostrar todos inicialmente
    });

    // Obtener la tarifa actual
    this.cargarTarifaActual();
  }

  async cargarTarifaActual(): Promise<void> {
    try {
      const datos = await this.tarifaHorarioService.obtenerDatos();
      this.tarifaBase = parseFloat(datos.valor); // Convertimos a número
    } catch (error) {
      console.error('Error al cargar la tarifa:', error);
    }
  }

  filtrarContratos(): void {
    if (this.usuarioSeleccionado) {
      this.contratosFiltrados = this.contratos.filter(
        (contrato) => contrato.usuarioId === this.usuarioSeleccionado
      );
    } else {
      this.contratosFiltrados = this.contratos; // Mostrar todos
    }
  }

  selectContrato(contrato: Contrato): void {
    this.selectedContrato = { ...contrato }; // Crear una copia para editar
  }

  async eliminarContrato(contratoId: string): Promise<void> {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este contrato?');
    if (confirmacion) {
      // Encontrar el contrato que se va a eliminar
      const contrato = this.contratos.find((c) => c.id === contratoId);
  
      if (!contrato) {
        alert('Contrato no encontrado.');
        return;
      }
  
      try {
        // Eliminar el contrato
        await this.userService.eliminarContrato(contratoId);
  
        // Marcar el espacio correspondiente como no reservado
        const espacioId = contrato.espacioId;
        await this.userService.updateEspacioReservado(espacioId, false);
  
        alert('Contrato eliminado exitosamente.');
  
        // Actualizar la lista de contratos y contratos filtrados
        this.contratos = this.contratos.filter((contrato) => contrato.id !== contratoId);
        this.filtrarContratos();
      } catch (error) {
        console.error('Error al eliminar el contrato:', error);
        alert('Hubo un error al eliminar el contrato.');
      }
    }
  }

  recalcularCosto(): void {
    if (this.selectedContrato && this.selectedContrato.duracionMeses) {
      this.selectedContrato.costoTotal =
        this.selectedContrato.duracionMeses * this.tarifaBase;
    }
  } 
  
  

  calcularFechaFin(fechaInicio: string, duracionMeses: number): string {
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + duracionMeses);
    return fecha.toISOString().split('T')[0];
  }
 
  
  async saveContrato(): Promise<void> {
    if (this.selectedContrato && this.selectedContrato.id) {
      try {
        await this.userService.updateContrato(this.selectedContrato.id, this.selectedContrato);
        alert('Contrato actualizado exitosamente.');
        this.cancelEdit(); // Reinicia el formulario y selecciona un nuevo contrato
      } catch (error) {
        console.error('Error al actualizar el contrato:', error);
        alert('Hubo un error al actualizar el contrato.');
      }
    } else {
      alert('No se pudo identificar el contrato para actualizar.');
    }
  }
  
  
  cancelEdit(): void {
    this.selectedContrato = null;
  }
}