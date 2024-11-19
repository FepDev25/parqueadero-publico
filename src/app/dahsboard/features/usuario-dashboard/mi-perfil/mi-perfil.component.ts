import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { User, UserServiceService } from '../../../servicios/user-service.service';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class MiPerfilComponent implements OnInit {
  user: User = {
    email: '',
    nombre: '',
    fechaNacimiento: '',
    role: '',
  };
  uid: string = '';
  localPhoto: string = '';
  editMode: boolean = false; // Estado para habilitar/deshabilitar edición

  constructor(private userService: UserServiceService, private auth: Auth) {}

  async ngOnInit(): Promise<void> {
    // Obtener el UID del usuario autenticado
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      this.uid = currentUser.uid;
  
      // Cargar datos del usuario desde Firestore
      const firestoreUser = await this.userService.getUser(this.uid);
      if (firestoreUser) {
        this.user = firestoreUser; // Cargar los datos iniciales
      } else {
        console.error('No se encontraron datos para este usuario en Firestore.');
      }
  
      // Cargar la imagen desde LocalStorage
      const storedPhoto = localStorage.getItem(`profile-photo-${this.uid}`);
      this.localPhoto = storedPhoto || 'assets/img/default-avatar.png'; // Imagen en Base64 o predeterminada
    } else {
      console.error('No hay un usuario autenticado actualmente.');
    }
  }
  

  toggleEditMode(): void {
    this.editMode = !this.editMode; // Alternar entre modo edición y visualización
    if (!this.editMode) {
      // Si se cancela la edición, recargar los datos desde Firestore
      this.ngOnInit();
    }
  }

  async saveProfile(): Promise<void> {
    if (this.uid) {
      await this.userService.updateUser(this.uid, this.user);
      if (this.localPhoto) {
        localStorage.setItem(`profile-photo-${this.uid}`, this.localPhoto);
      }
      toast.success("Usuario creado correctamente.");
      this.editMode = false; // Salir del modo edición
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.localPhoto = reader.result as string; // Convertir a Base64
      };
      reader.readAsDataURL(file);
    }
  }

  clearProfile(): void {
    this.localPhoto = '';
    localStorage.removeItem(`profile-photo-${this.uid}`);
    alert('Imagen de perfil eliminada');
  }
}
