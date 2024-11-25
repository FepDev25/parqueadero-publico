import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { FooterComponent } from '../../../home/footer/footer.component';

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './cajero-dashboard.component.html',
  styles: ``
})
export class CajeroDashboardComponent implements OnInit {
  menuOpen = false;
  private _router = inject(Router);

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  private _authService = inject(AuthService);
  nombreCajeroActual: string | undefined = "";

  async ngOnInit() {
    await this.obtenerNombreUsuarioActual();
  }

  async obtenerNombreUsuarioActual() {
    const currentUser = await this._authService.getCurrentUser();
    if (currentUser?.nombre) {
      // Divide el nombre en palabras y toma solo las dos primeras
      const palabras = currentUser.nombre.split(' ');
      this.nombreCajeroActual = palabras.slice(0, 2).join(' '); // Toma las primeras dos palabras
    } else {
      this.nombreCajeroActual = "Cajero"; // Fallback si no hay nombre
    }
  }

  logout() {
    this._authService.logout().then(() => {
      this._router.navigate(['/auth/sign-in']);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
  
}
