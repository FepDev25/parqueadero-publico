import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User as FirebaseUser, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { RoleSelectorModalComponent } from '../features/role-selector-modal/role-selector-modal.component';

export interface User {
  email: string;
  password: string;
  nombre: string;
  fechaNacimientoTimestamp: Timestamp;
  role: string; 
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private dialog: MatDialog) {}


  private _auth = inject(Auth);
  private _firestore = inject(Firestore);


  async getCurrentUser(): Promise<User | null> {
    const firebaseUser: FirebaseUser | null = this._auth.currentUser;

    if (firebaseUser) {
      const userDocRef = doc(this._firestore, `usuarios/${firebaseUser.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        return userData;
      }
    }
    return null;
  }

  async signUp(user: User) {
    try {
      // Crear la cuenta de usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this._auth, user.email, user.password);

      // Crear el documento del usuario en Firestore con los datos adicionales
      const userDocRef = doc(this._firestore, `usuarios/${userCredential.user.uid}`);
      await setDoc(userDocRef, {
        nombre: user.nombre,
        fechaNacimiento: user.fechaNacimientoTimestamp,
        role: user.role // Guardar el rol
      });

      console.log("Usuario registrado y datos adicionales guardados en Firestore.");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    const userCredential = await signInWithEmailAndPassword(this._auth, email, password);
    const uid = userCredential.user.uid;

    // Obtener el rol del usuario desde Firestore
    const userDocRef = doc(this._firestore, `usuarios/${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData; // Retorna los datos del usuario, incluyendo el rol
    } else {
      throw new Error("Usuario no encontrado en Firestore.");
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
          // Si el usuario es nuevo, solicitará un rol
          const selectedRole = await this.askUserForRole();
          await setDoc(userDocRef, {
            email: user.email,
            nombre: user.displayName,
            fechaNacimiento: null,
            role: selectedRole
          });
          console.log("Usuario de Google guardado en Firestore con rol seleccionado.");
        } else {
          // Si el usuario ya existe, verifica que tenga un rol asignado
          const userData = userDocSnap.data();
          if (!userData?.['role']) {
            const selectedRole = await this.askUserForRole();
            await setDoc(userDocRef, { ...userData, role: selectedRole }, { merge: true });
            console.log("Rol asignado a usuario de Google existente en Firestore.");
          } else {
            console.log("Usuario de Google ya existe y tiene rol en Firestore.");
          }
        }
      }
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
    }
  }

  async askUserForRole(): Promise<string> {
    const dialogRef = this.dialog.open(RoleSelectorModalComponent, {
      width: '300px',
      disableClose: true
    });
  
    return new Promise<string>((resolve) => {
      dialogRef.componentInstance.roleSelected.subscribe((role: string) => {
        dialogRef.close();
        resolve(role);  
      });
    });
  }
  
  
  
}
