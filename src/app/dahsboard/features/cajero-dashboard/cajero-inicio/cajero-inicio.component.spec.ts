import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroInicioComponent } from './cajero-inicio.component';

describe('CajeroInicioComponent', () => {
  let component: CajeroInicioComponent;
  let fixture: ComponentFixture<CajeroInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
