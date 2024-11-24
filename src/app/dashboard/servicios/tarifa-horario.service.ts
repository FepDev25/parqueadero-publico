import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TarifaHorarioService {
  private tarifaDocRef: any;

  constructor(private firestore: Firestore) {
    this.tarifaDocRef = doc(this.firestore, 'tarifa/tarifa');
  }

  async obtenerDatos(): Promise<{ valor: string }> {
    const docSnapshot = await getDoc(this.tarifaDocRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data() as { valor: string };
    }
    throw new Error('No se encontró el documento de tarifa');
  }

  async actualizarTarifa(valor: string): Promise<void> {
    await updateDoc(this.tarifaDocRef, { valor });
  }
}
