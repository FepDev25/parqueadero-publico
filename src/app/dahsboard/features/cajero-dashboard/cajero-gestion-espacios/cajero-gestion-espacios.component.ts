import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Espacio, Contrato, EspaciosService } from '../../../servicios/espacio.service';
import { TarifaHorarioService } from '../../../servicios/tarifa-horario.service';

@Component({
  selector: 'app-cajero-gestion-espacios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajero-gestion-espacios.component.html',
  styles: [`
    .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  padding: 20px;
  justify-items: center;
}

.espacio {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.espacio:hover {
  transform: scale(1.05);
}

.disponible {
  background-color: #28a745;
  color: white;
}

.ocupado {
  background-color: #dc3545;
  color: white;
}

.reservado {
  background-color: #fd7e14;
  color: white;
}

.hora-ocupado {
  font-size: 12px;
  margin-top: 8px;
  color: #fdfd96; /* Amarillo claro */
}

.liberar-button {
  margin-top: 8px;
  background-color: white;
  color: red;
  font-size: 12px;
  border: 1px solid red;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 10px;
  transition: all 0.2s ease;
}

.liberar-button:hover {
  background-color: red;
  color: white;
}

input[type="number"] {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

  `]
})
export class CajeroGestionEspaciosComponent {
  espacios: Espacio[] = [];
  contratos: Contrato[] = [];
  idEspacioOcupar: number | null = null;
  cedulaClienteOcupar: string = "";
  tarifa: number | null = null;
  precioActual: number | null = null;

  mensajeError: string | null = null;
  mensajeConfirmacion: string | null = null;

  constructor(
    private espaciosService: EspaciosService,
    private tarifaHorarioService: TarifaHorarioService
  ) {
    this.espaciosService.getEspacios().subscribe(
      (espacios: any[]) => {
        this.espacios = espacios.sort((a, b) => a.id - b.id);
        console.log('Lista de espacios cargada:', this.espacios);
      },
      error => {
        console.error('Error al cargar los espacios:', error);
      }
    );
  }

  async ngOnInit() {
    await this.obtenerTarifa();
  }

  async obtenerTarifa() {
    try {
      const datos = await this.tarifaHorarioService.obtenerDatos();
      this.tarifa = parseFloat(datos.valor);
      console.log('Tarifa actual:', this.tarifa);
    } catch (error) {
      console.error('Error al obtener la tarifa:', error);
      this.mostrarMensajeError('No se pudo cargar la tarifa actual.');
    }
  }
  
  marcarContratos(): void {
    this.contratos.forEach((contrato) => {
      const espacio = this.espacios.find((e) => e.id === contrato.espacioId);
      if (espacio) {
        espacio.ocupado = true;
        espacio.reservado = true;
        espacio.usuarioReservado = contrato.usuarioId;
      }
    });
  }

  async marcarComoOcupado(): Promise<void> {
    if (this.idEspacioOcupar !== null) {
      const espacio = this.espacios.find(e => e.id === this.idEspacioOcupar);

      if (espacio && !espacio.ocupado) {
        let nombreCliente: string | null = null;

        if (this.cedulaClienteOcupar) {
          // Validar si la cédula ingresada existe
          const cedulaValida = await this.espaciosService.validarCedula(this.cedulaClienteOcupar);
          if (!cedulaValida) {
            this.mostrarMensajeError('La cédula ingresada no existe en el sistema.');
            return;
          }

          // Obtener el nombre del cliente asociado a la cédula
          const cliente = await this.espaciosService.obtenerClientePorCedula(this.cedulaClienteOcupar);
          nombreCliente = cliente?.nombre || null;
        }

        this.espaciosService.ocuparEspacio(this.idEspacioOcupar, this.cedulaClienteOcupar)
          .then(() => {
            espacio.ocupado = true;
            espacio.horaOcupado = new Date();
            this.idEspacioOcupar = null;
            this.cedulaClienteOcupar = ""; 

            if (nombreCliente) {
              this.mostrarMensajeConfirmacion(`Espacio marcado: ${espacio.id}, Cliente: ${nombreCliente}`);
            } else {
              this.mostrarMensajeConfirmacion(`Espacio marcado: ${espacio.id}`);
            }

            console.log('Espacio marcado como ocupado:', espacio);
          })
          .catch(error => {
            console.error('Error al marcar espacio como ocupado:', error);
            alert('No se pudo marcar el espacio como ocupado.');
          });
      } else {
        this.mostrarMensajeError('El espacio ya está ocupado o no es válido.');
      }
    } else {
      this.mostrarMensajeError('Por favor, ingrese un ID de espacio válido.');
    }
  }

  
  
  
  liberarEspacio(id: number): void {
    const espacio = this.espacios.find(e => e.id === id);
  
    if (espacio && espacio.ocupado) {
      this.espaciosService.liberarEspacio(id)
        .then(precio => {
          espacio.ocupado = false;
          espacio.horaOcupado = new Date();
          this.precioActual = precio;
          this.mostrarMensajeConfirmacion(`Espacio liberado: ${id}. Precio total a cobrar: $${precio}`);
        })
        .catch(error => {
          console.error('Error al liberar el espacio:', error);
          alert('No se pudo liberar el espacio.');
        });
    } else {
      alert('El espacio no está ocupado o no es válido.');
    }
  }
  
  esReservado(id: number): boolean {
    return this.contratos.some((contrato) => contrato.espacioId === id);
  }

  obtenerDetallesContrato(id: number): Contrato | undefined {
    return this.contratos.find((contrato) => contrato.espacioId === id);
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 5000);
  }

  mostrarMensajeConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    setTimeout(() => {
      this.mensajeConfirmacion = null;
    }, 5000);
  }

}
