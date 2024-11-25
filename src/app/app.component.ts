import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InicioComponent } from './home/inicio/inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InicioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
}