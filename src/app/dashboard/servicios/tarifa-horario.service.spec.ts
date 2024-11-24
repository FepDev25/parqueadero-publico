import { TestBed } from '@angular/core/testing';

import { TarifaHorarioService } from './tarifa-horario.service';

describe('TarifaHorarioService', () => {
  let service: TarifaHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarifaHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
