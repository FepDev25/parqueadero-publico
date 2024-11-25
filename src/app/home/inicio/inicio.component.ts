import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ContactoComponent } from '../contacto/contacto.component';
import { AcercaDeComponent } from '../acerca-de/acerca-de.component';
import { InformacionComponent } from '../informacion/informacion.component';
import { MainContentComponent } from '../main-content/main-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatDialogModule, RouterModule, RouterLink, CommonModule, FooterComponent, ContactoComponent, AcercaDeComponent, InformacionComponent, MainContentComponent],
  templateUrl: './inicio.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioComponent {
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
