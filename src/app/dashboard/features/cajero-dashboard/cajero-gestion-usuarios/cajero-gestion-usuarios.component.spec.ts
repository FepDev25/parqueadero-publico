import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroGestionUsuariosComponent } from './cajero-gestion-usuarios.component';

describe('CajeroGestionUsuariosComponent', () => {
  let component: CajeroGestionUsuariosComponent;
  let fixture: ComponentFixture<CajeroGestionUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroGestionUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroGestionUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
