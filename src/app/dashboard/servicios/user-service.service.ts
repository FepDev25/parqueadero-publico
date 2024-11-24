import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, updateDoc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id?: string; 
  email: string;
  nombre: string;
  fechaNacimiento?: string;
  role: string;
  cedula?: string;
}

export interface Contrato {
  id?: string; 
  usuarioId: string; 
  espacioId: number; 
  fechaInicio: string; 
  duracionMeses: number; 
  costoTotal: number; 
}

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private firestore: Firestore) {}

  // Obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'usuarios');
    return collectionData(usersCollection, { idField: 'id' }) as Observable<User[]>;
  }

  // Obtener un usuario por ID
  async getUser(userId: string): Promise<User | null> {
    const userDocRef = doc(this.firestore, `usuarios/${userId}`);
    const userDocSnap = await getDoc(userDocRef);
  
    if (userDocSnap.exists()) {
      return userDocSnap.data() as User;
    }
    return null;
  }

  // Actualizar usuario
  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `usuarios/${userId}`); 
    await updateDoc(userDocRef, userData);
    console.log('Usuario actualizado en Firestore');
  }

  // Crear contrato
  async crearContrato(contrato: Contrato): Promise<void> {
    const contratosCollection = collection(this.firestore, 'contratos');
    await addDoc(contratosCollection, contrato);
    console.log('Contrato creado exitosamente.');
  }

  // Obtener contratos por cédula de usuario
  getContratosPorUsuario(cedula: string): Observable<Contrato[]> {
    const contratosCollection = collection(this.firestore, 'contratos');
    return collectionData(contratosCollection, { idField: 'id' }) as Observable<Contrato[]>;
  }

  // Obtener todos los contratos
  getAllContratos(): Observable<Contrato[]> {
    const contratosCollection = collection(this.firestore, 'contratos');
    return collectionData(contratosCollection, { idField: 'id' }) as Observable<Contrato[]>;
  }

  // Eliminar contrato por ID
  async eliminarContrato(contratoId: string): Promise<void> {
    const contratoDocRef = doc(this.firestore, `contratos/${contratoId}`);
    await deleteDoc(contratoDocRef); // Usa deleteDoc en lugar de .delete()
    console.log(`Contrato con ID ${contratoId} eliminado exitosamente.`);
  }

  // Actualizar estado de reservado de un espacio
  async updateEspacioReservado(espacioId: number, reservado: boolean): Promise<void> {
    const espacioDocRef = doc(this.firestore, `espacios/${espacioId}`);
    const espacioDocSnap = await getDoc(espacioDocRef);

    if (espacioDocSnap.exists()) {
      await updateDoc(espacioDocRef, { reservado });
      console.log(`Espacio ${espacioId} actualizado: reservado = ${reservado}`);
    } else {
      throw new Error('Espacio no encontrado.');
    }
  }

  async updateContrato(contratoId: string, contrato: Partial<Contrato>): Promise<void> {
    const contratoDocRef = doc(this.firestore, `contratos/${contratoId}`);
    await updateDoc(contratoDocRef, contrato);
    console.log(`Contrato con ID ${contratoId} actualizado exitosamente.`);
  }
  


}

