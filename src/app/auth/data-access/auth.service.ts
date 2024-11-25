import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, Timestamp, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { RoleSelectorModalComponent } from '../features/role-selector-modal/role-selector-modal.component';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { collection, getDocs, query } from '@angular/fire/firestore';

export interface User {
  email: string;
  password: string;
  nombre: string;
  cedula: string;
  fechaNacimiento: string; 
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  constructor(private dialog: MatDialog, private router: Router) {}

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

  async logout(): Promise<void> {
    try {
      await this._auth.signOut(); 
      this.router.navigate(['/auth/sign-in']); 
      toast.success('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión.');
    }
  }
  

  async signUp(user: User) {
    try {
      const allowedEmailsCollection = collection(this._firestore, 'allowedEmails');
      const allowedEmailsSnapshot = await getDocs(query(allowedEmailsCollection));
  
      const allowedEmails = allowedEmailsSnapshot.docs.map(doc => doc.id);
  
      let role = 'usuario';
        allowedEmails.forEach(emailCajero => {
          console.log(emailCajero);
          console.log(user.email);
          if (emailCajero === user.email) {
            role = 'cajero';
          }
          console.log(emailCajero === user.email);
        });
      user.role = role;
      console.log(user.role);

      const userCredential = await createUserWithEmailAndPassword(this._auth, user.email, user.password);
      console.log("creando credencial");
  
      const userDocRef = doc(this._firestore, `usuarios/${userCredential.user.uid}`);
      await setDoc(userDocRef, {
        nombre: user.nombre,
        fechaNacimiento: user.fechaNacimiento,
        role: role,
        email: user.email,
        cedula: user.cedula || '', 
      });
      
  
      console.log('Usuario registrado y datos adicionales guardados en Firestore.');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      toast.error('Error al crear el usuario.');
    }
  }
  

  async signIn(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this._auth, email, password);
      const uid = userCredential.user.uid;
  
      const userDocRef = doc(this._firestore, `usuarios/${uid}`);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userData['fechaNacimiento'] = userData['fechaNacimiento'] || '';
        return userData;
      }
       else {
        throw new Error('Usuario no encontrado en Firestore.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }
  
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this._auth, provider);
      const user = result.user;
  
      if (user) {
        const email = user.email || '';
        console.log(email);
        
        const allowedEmailsCollection = collection(this._firestore, 'allowedEmails');
        const allowedEmailsSnapshot = await getDocs(query(allowedEmailsCollection));
        const allowedEmails = allowedEmailsSnapshot.docs.map(doc => doc.id);
        console.log(allowedEmails);
  
        let role = 'usuario';
        allowedEmails.forEach(emailCajero => {
          if (emailCajero === email) {
            role = 'cajero';
          }
        });
  
        const userDocRef = doc(this._firestore, `usuarios/${user.uid}`);
        const userDocSnap = await getDoc(userDocRef);
  
        let userData: any;
        if (!userDocSnap.exists()) {

          await setDoc(userDocRef, {
            email: email,
            nombre: user.displayName || 'Usuario Sin Nombre',
            fechaNacimiento: '', 
            cedula: '',
            role,
          });
          
        } else {
          userData = userDocSnap.data();
        }
  
        if (!userData || !userData['cedula']) {
          const dialogRef = this.dialog.open(RoleSelectorModalComponent, {
            width: '400px',
            disableClose: true,
          });
  
          dialogRef.componentInstance.cedulaCompleted.subscribe(async (cedula: string) => {
            // Actualizar la cédula en Firestore
            await updateDoc(userDocRef, { cedula });
            dialogRef.close(); // Cerrar el modal
            toast.success('Cédula registrada correctamente.');
  
            // Redirigir al dashboard según el rol
            const redirectUrl = role === 'cajero' ? '/auth/cajero-dashboard' : '/auth/usuario-dashboard';
            this.router.navigate([redirectUrl]);
          });
        } else {
          // Redirigir al dashboard si ya tiene la cédula registrada
          const redirectUrl = userData['role'] === 'cajero' ? '/auth/cajero-dashboard' : '/auth/usuario-dashboard';
          this.router.navigate([redirectUrl]);
        }
      }
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      toast.error('Error al autenticarse con Google.');
    }
  }
   
  
  
  
}
