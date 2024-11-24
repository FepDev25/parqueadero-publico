import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroGestionContratosComponent } from './cajero-gestion-contratos.component';

describe('CajeroGestionContratosComponent', () => {
  let component: CajeroGestionContratosComponent;
  let fixture: ComponentFixture<CajeroGestionContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroGestionContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroGestionContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
