import { Component, inject, input, output } from '@angular/core';
import { Connection } from '../../../shared/interfaces/connection.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-item',
  imports: [],
  templateUrl: './connection-item.component.html',
})
export class ConnectionItemComponent {
  connection = input.required<Connection>();
  deleteConnection = output<Connection>();
  confirmDelete = false;
  readonly #router = inject(Router);

  openConfirm() {
    this.confirmDelete = true;
  }

  closeConfirm() {
    this.confirmDelete = false;
  }

  confirmAndDelete() {
    this.deleteConnection.emit(this.connection());
    this.confirmDelete = false;
  }

  goToConnection() {
    const id = this.connection()?.id;
    if (id) {
      this.#router.navigate(['/connections', id, 'couple']);
    }
  }
  goToUpdate() {
    const id = this.connection()?.id;
    if (id) {
      this.#router.navigate([`/connections/${id}/couple/update`]);
    }
  }

}
