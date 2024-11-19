import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroGestionEspaciosComponent } from './cajero-gestion-espacios.component';

describe('CajeroGestionEspaciosComponent', () => {
  let component: CajeroGestionEspaciosComponent;
  let fixture: ComponentFixture<CajeroGestionEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroGestionEspaciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroGestionEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
