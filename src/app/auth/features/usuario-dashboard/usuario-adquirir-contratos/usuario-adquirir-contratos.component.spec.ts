import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAdquirirContratosComponent } from './usuario-adquirir-contratos.component';

describe('UsuarioAdquirirContratosComponent', () => {
  let component: UsuarioAdquirirContratosComponent;
  let fixture: ComponentFixture<UsuarioAdquirirContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioAdquirirContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioAdquirirContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
