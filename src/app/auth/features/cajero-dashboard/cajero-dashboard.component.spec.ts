import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajeroDashboardComponent } from './cajero-dashboard.component';

describe('CajeroDashboardComponent', () => {
  let component: CajeroDashboardComponent;
  let fixture: ComponentFixture<CajeroDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajeroDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajeroDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
