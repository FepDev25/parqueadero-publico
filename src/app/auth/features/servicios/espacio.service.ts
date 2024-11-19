import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, getDoc, DocumentData, CollectionReference, query, getDocs, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaz Espacio
export interface Espacio {
  id: number;
  ocupado: boolean;
  horaOcupado?: Date; 
  reservado: boolean;
  usuarioReservado?: string; 
}

// Interfaz Contrato
export interface Contrato {
  espacioId: number; 
  usuarioId: string;
  horaReserva: Date;
  duracionMeses: number;
}

@Injectable({
  providedIn: 'root',
})
export class EspaciosService {
  private espaciosCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.espaciosCollection = collection(this.firestore, 'espacios');
  }

  // Obtener todos los espacios
  getEspacios(): Observable<Espacio[]> {
    return collectionData(collection(this.firestore, 'espacios'), { idField: 'id' }).pipe(
      map((espacios: any[]) =>
        espacios.map(espacio => ({
          ...espacio,
          id: typeof espacio.id === 'string' ? parseInt(espacio.id, 10) : espacio.id, // Convertimos a número si es string
          horaOcupado: espacio.horaOcupado ? new Date(espacio.horaOcupado.seconds * 1000) : undefined, // Convertimos timestamp a Date
        }))
      )
    );
  }

  // Marcar espacio como ocupado
  async ocuparEspacio(id: number, cedula : string): Promise<void> {
    const espacioDoc = doc(this.firestore, `espacios/${id}`);
    const espacioSnapshot = await getDoc(espacioDoc);
  
    if (espacioSnapshot.exists()) {
      const data = espacioSnapshot.data();
      if (data['ocupado']) {
        throw new Error('El espacio ya está ocupado.');
      }
      
      await updateDoc(espacioDoc, {
        ocupado: true,
        horaOcupado: new Date(),
        usuarioReservado: cedula
      });
    } else {
      throw new Error('El espacio no existe.');
    }
  }
  

  // Liberar un espacio
  async liberarEspacio(id: number): Promise<number> {
    const espacioDoc = doc(this.firestore, `espacios/${id}`);
    const espacioSnapshot = await getDoc(espacioDoc);
  
    if (espacioSnapshot.exists()) {
      const espacioData = espacioSnapshot.data();
      const horaOcupado = espacioData['horaOcupado'] ? new Date(espacioData['horaOcupado'].seconds * 1000) : null;
  
      if (!horaOcupado) {
        throw new Error('El espacio no tiene una hora de ocupación válida.');
      }
  
      const ahora = new Date();
      const tiempoOcupado = (ahora.getTime() - horaOcupado.getTime()) / (1000 * 60 * 60); // En horas

      const tarifa = await this.obtenerTarifaActual();

      const precio = Math.ceil(tiempoOcupado * tarifa);
  
      // Libera el espacio
      await updateDoc(espacioDoc, {
        ocupado: false,
        horaOcupado: null,
      });
  
      return precio;
    }
  
    throw new Error('El espacio no existe.');
  }


  private async obtenerTarifaActual(): Promise<number> {
    const tarifaDoc = doc(this.firestore, 'tarifa/tarifa');
    const tarifaSnapshot = await getDoc(tarifaDoc);
  
    if (tarifaSnapshot.exists()) {
      return parseFloat(tarifaSnapshot.data()['valor']);
    }
  
    throw new Error('No se pudo obtener la tarifa actual.');
  }

  // Obtener contratos
  async getContratos(): Promise<Contrato[]> {
    const contratosCollection = collection(this.firestore, 'contratos');
    const snapshot = await collectionData(contratosCollection, { idField: 'id' }).toPromise();
    return snapshot as Contrato[];
  }

  // Validar si una cédula existe en la colección de usuarios
  async validarCedula(cedula: string): Promise<boolean> {
    const usuariosCollection = collection(this.firestore, 'usuarios');

    console.log("collecion de usuarios");
    console.log(usuariosCollection);

    const cedulaQuery = query(usuariosCollection, where('cedula', '==', cedula));
    const querySnapshot = await getDocs(cedulaQuery);
    return !querySnapshot.empty;
  }

  // Obtener los datos del cliente por cédula
  async obtenerClientePorCedula(cedula: string): Promise<{ nombre: string } | null> {
    const usuariosCollection = collection(this.firestore, 'usuarios');
    const cedulaQuery = query(usuariosCollection, where('cedula', '==', cedula));
    const querySnapshot = await getDocs(cedulaQuery);

    if (!querySnapshot.empty) {
      const usuarioDoc = querySnapshot.docs[0];
      return { nombre: usuarioDoc.data()['nombre'] };
    }

    return null;
  }



  
}
