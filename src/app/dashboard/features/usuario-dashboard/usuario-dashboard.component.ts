import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { FooterComponent } from '../../../home/footer/footer.component';

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './usuario-dashboard.component.html',
  styles: ``
})
export class UsuarioDashboardComponent implements OnInit {
  menuOpen = false; 

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  private _authService = inject(AuthService);
  nombreUsuarioActual: string | undefined = "";

  async ngOnInit() {
    await this.obtenerNombreUsuarioActual();
  }

  async obtenerNombreUsuarioActual() {
    const currentUser = await this._authService.getCurrentUser();
    if (currentUser?.nombre) {
      const palabras = currentUser.nombre.split(' ');
      this.nombreUsuarioActual = palabras.slice(0, 2).join(' ');
    } else {
      this.nombreUsuarioActual = "Usuario";
    }
  }
  
}
