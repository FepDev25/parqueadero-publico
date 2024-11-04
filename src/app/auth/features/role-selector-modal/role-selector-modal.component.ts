import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-role-selector-modal',
  standalone: true,
  imports: [],
  templateUrl: './role-selector-modal.component.html',
  styles: ``
})
export class RoleSelectorModalComponent {
  @Output() roleSelected = new EventEmitter<string>();

  selectRole(role: string) {
    this.roleSelected.emit(role);
  }
}