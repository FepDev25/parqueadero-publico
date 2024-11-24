import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroTarifaHorarioComponent } from './cajero-tarifa-horario.component';

describe('CajeroTarifaHorarioComponent', () => {
  let component: CajeroTarifaHorarioComponent;
  let fixture: ComponentFixture<CajeroTarifaHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroTarifaHorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroTarifaHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
