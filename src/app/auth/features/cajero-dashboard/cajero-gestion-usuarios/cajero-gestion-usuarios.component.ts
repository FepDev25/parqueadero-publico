import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User, UserServiceService } from '../../servicios/user-service.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../data-access/auth.service';

@Component({
  selector: 'app-cajero-gestion-usuarios',
  templateUrl: './cajero-gestion-usuarios.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class CajeroGestionUsuariosComponent implements OnInit {
  users$: Observable<User[]> | undefined; 
  selectedUser: User = {
    email: '',
    nombre: '',
    fechaNacimiento: '',
    role: '', 
    cedula: ''
  };
  
  selectedUserId: string = ''; 
  localPhoto: string = ''; 
  currentUser: User | null = null; 

  constructor(
    private userService: UserServiceService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.users$ = this.userService.getAllUsers();

    // Obtener el usuario actual
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUser = {
        email: currentUser.email,
        nombre: currentUser.nombre,
        role: currentUser.role,
        cedula: currentUser.cedula,
      };
    }
  }


  async selectUser(user: User): Promise<void> {
    // Solo selecciona al usuario si es el usuario actual o un cliente
    if (this.currentUser && (user.role !== 'cajero' || user.cedula === this.currentUser.cedula)) {
      this.selectedUser = { ...user }; // Copia el usuario seleccionado
      this.selectedUserId = user.id ?? '';

      const storedPhoto = localStorage.getItem(`profile-photo-${this.selectedUserId}`);
      this.localPhoto = storedPhoto ?? '';
    } else {
      alert('No puedes editar a otros cajeros.');
    }
  }
  

  async deleteUser(indice : Number): Promise<void> {
    
  }

  async saveUser(): Promise<void> {
    if (this.selectedUserId) {
      await this.userService.updateUser(this.selectedUserId, {
        email: this.selectedUser.email,
        nombre: this.selectedUser.nombre,
        fechaNacimiento: this.selectedUser.fechaNacimiento,
        role: this.selectedUser.role,
      });

      localStorage.setItem(`profile-photo-${this.selectedUserId}`, this.localPhoto);

      alert('Perfil actualizado exitosamente');
      this.cancelEdit();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.localPhoto = reader.result as string; // Convertir a Base64
      };
      reader.readAsDataURL(file); // Procesar como Base64
    }
  }

  cancelEdit(): void {
    this.selectedUser = {
      email: '',
      nombre: '',
      fechaNacimiento: '',
      role: '',
      cedula: ''
    };
    this.selectedUserId = '';
    this.localPhoto = '';
  }
}