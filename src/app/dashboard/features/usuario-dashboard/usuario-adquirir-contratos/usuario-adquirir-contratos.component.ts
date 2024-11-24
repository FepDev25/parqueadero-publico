import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { Contrato, UserServiceService } from '../../../servicios/user-service.service';
import { TarifaHorarioService } from '../../../servicios/tarifa-horario.service';
import { Espacio, EspaciosService } from '../../../servicios/espacio.service';

@Component({
  selector: 'app-usuario-adquirir-contratos',
  templateUrl: './usuario-adquirir-contratos.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule], 
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
  contratoSeleccionado: number | null = null;
  mostrarFormulario: boolean = false;
  rangosEspacios: string[] = ['1-25', '26-50', '51-75', '76-100'];
  rangoSeleccionado: string = '1-25';
  tarifaActual!: number; 
  errorMeses: boolean = false; 
  errorFecha: boolean = false; 


  constructor(
    private userService: UserServiceService,
    private tarifaService: TarifaHorarioService, 
    private espaciosService: EspaciosService,
    private auth: Auth
  ) {}
  
  async ngOnInit(): Promise<void> {
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        const userData = await this.userService.getUser(currentUser.uid);
        if (userData && userData.cedula) {
          this.cedulaUsuario = userData.cedula;
          this.cargarContratos();
          this.cargarEspacios();  
          const datos = await this.tarifaService.obtenerDatos();
          this.tarifaActual = parseFloat(datos.valor); 
        }
      }
    } catch (error) {
      console.error('Error al inicializar:', error);
      alert('Error al cargar datos.');
    }
  }
  
  
  cargarEspacios(): void {
    this.espaciosService.getEspacios().subscribe(
      (espacios: Espacio[]) => {
        this.espaciosDisponibles = espacios.filter(e => !e.ocupado); 
        this.espaciosOcupadosFiltrados = espacios.filter(e => e.ocupado); 
        this.filtrarEspaciosPorRango();
      },
      (error) => {
        console.error('Error al cargar espacios:', error);
        alert('No se pudieron cargar los espacios.');
      }
    );
  }
  
  cargarContratos(): void {
    this.userService.getContratosPorUsuario(this.cedulaUsuario).subscribe(
      (contratos: Contrato[]) => {
        this.contratos = contratos.filter(c => c.usuarioId === this.cedulaUsuario);
      },
      (error) => {
        console.error('Error al cargar los contratos:', error);
        alert('No se pudieron cargar los contratos.');
      }
    );
  }
  

  filtrarEspaciosPorRango(): void {
    const [inicio, fin] = this.rangoSeleccionado.split('-').map(Number);
  
    this.espaciosDisponiblesFiltrados = this.espaciosDisponibles.filter(
      espacio => espacio.id >= inicio && espacio.id <= fin
    );
  
    this.espaciosOcupadosFiltrados = this.espaciosOcupadosFiltrados.filter(
      espacio => espacio.id >= inicio && espacio.id <= fin
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
  
    if (!this.tarifaActual) {
      alert('No se pudo obtener la tarifa actual.');
      return;
    }
  
    const costoTotal = this.contrato.duracionMeses! * this.tarifaActual;
    const nuevoContrato: Contrato = {
      usuarioId: this.cedulaUsuario,
      espacioId: this.espacioSeleccionado,
      fechaInicio: this.contrato.fechaInicio!,
      duracionMeses: this.contrato.duracionMeses!,
      costoTotal,
    };
  
    try {
      // Crear el contrato en Firestore
      await this.userService.crearContrato(nuevoContrato);
  
      // Marcar el espacio como ocupado en la colección espacios
      await this.espaciosService.ocuparEspacio(this.espacioSeleccionado, this.cedulaUsuario);
  
      // Recargar espacios disponibles
      this.cargarEspacios();
  
      alert('Contrato adquirido exitosamente.');
      this.contrato = { duracionMeses: 0, fechaInicio: '' };
      this.espacioSeleccionado = null;
    } catch (error) {
      console.error('Error al adquirir contrato:', error);
      alert('Hubo un error al adquirir el contrato.');
    }
  }
  

  mostrarInformacion(contrato: Contrato): void {
    this.contratoSeleccionado =
      this.contratoSeleccionado === contrato.espacioId ? null : contrato.espacioId;
  }

  calcularFechaFin(fechaInicio: string, duracionMeses: number): string {
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + duracionMeses);
    return fecha.toISOString().split('T')[0]; 
  }
  async cargarTarifa(): Promise<void> {
    try {
      const datos = await this.tarifaService.obtenerDatos();
      if (datos && datos.valor) {
        this.tarifaActual = parseFloat(datos.valor);
      } else {
        throw new Error('Error en la tarifa');
      }
    } catch (error) {
      alert('Error en la tarifa en FB');
      throw new Error('Error en la tarifa desde FS'); 
    }
  }

  validarFecha(): void {
    if (!this.contrato.fechaInicio) {
      this.errorFecha = true;
      return;
    }
    const fechaSeleccionada = new Date(this.contrato.fechaInicio);
    const fechaHoy = new Date();
    fechaSeleccionada.setHours(0, 0, 0, 0);
    fechaHoy.setHours(0, 0, 0, 0);  
    const diaAnterior = new Date(fechaHoy);
    diaAnterior.setDate(fechaHoy.getDate() - 1); 
    if (fechaSeleccionada < diaAnterior || fechaSeleccionada > fechaHoy) {
      this.errorFecha = true; 
    } else {
      this.errorFecha = false; 
    }
  }
  
  validarMeses(): void {
    if (this.contrato.duracionMeses! <= 0) {
      this.errorMeses = true; 
    } else {
      this.errorMeses = false; 
    }
  }

  
  
  
}