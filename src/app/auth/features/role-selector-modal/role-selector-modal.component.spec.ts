import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSelectorModalComponent } from './role-selector-modal.component';

describe('RoleSelectorModalComponent', () => {
  let component: RoleSelectorModalComponent;
  let fixture: ComponentFixture<RoleSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSelectorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
