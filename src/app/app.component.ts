import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatDialogModule, RouterLink, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agregar aquí
})
export class AppComponent {
  showHome: boolean = true;
  showOnlyHeader: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const onlyHeaderRoutes = ['/auth/sign-in', '/auth/sign-up'];
      const hideHeaderRoutes = ['/auth/cajero-dashboard', '/auth/usuario-dashboard'];

      this.showOnlyHeader = onlyHeaderRoutes.some(route => this.router.url.startsWith(route));
      this.showHome = !hideHeaderRoutes.some(route => this.router.url.startsWith(route)) && !this.showOnlyHeader;
    });
  }
}
