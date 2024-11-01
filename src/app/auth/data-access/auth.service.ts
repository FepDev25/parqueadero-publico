import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';

export interface User {
  email: string;
  password: string;
  nombre: string;
  fechaNacimientoTimestamp: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  async signUp(user: User) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this._auth, user.email, user.password);

      const userDocRef = doc(this._firestore, `usuarios/${userCredential.user.uid}`);
      await setDoc(userDocRef, {
        nombre: user.nombre,
        fechaNacimiento: user.fechaNacimientoTimestamp
      });

      console.log("Usuario registrado y datos adicionales guardados en Firestore.");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this._auth, provider);
      const user = result.user;

      if (user) {
        const userDocRef = doc(this._firestore, `usuarios/${user.uid}`);
        
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            nombre: user.displayName,
            fechaNacimiento: null
          });
          console.log("Usuario de Google guardado en Firestore.");
        } else {
          console.log("Usuario de Google ya existe en Firestore.");
        }
      }
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
    }
  }
}
