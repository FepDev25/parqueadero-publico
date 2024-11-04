import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './data-access/auth.service'; // Ajusta esta ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const requiredRole = route.data['role'];
    const user = await this.authService.getCurrentUser(); // Asegúrate de que AuthService tenga un método para obtener el usuario actual

    if (user && user.role === requiredRole) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}
