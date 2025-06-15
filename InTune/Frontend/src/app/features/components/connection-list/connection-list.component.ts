import { Component, inject, input, signal } from '@angular/core';
import { Connection } from '../../../shared/interfaces/connection.interface';
import { ConnectionItemComponent } from '../connection-item/connection-item.component';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../shared/services/connection/connection.service';

@Component({
  selector: 'app-connection-list',
  imports: [ConnectionItemComponent],
  templateUrl: './connection-list.component.html',
})
export class ConnectionListComponent {
  connections = input.required<Connection[]>();
  readonly #router= inject(Router)
  readonly #connectionService = inject(ConnectionService);


  onCreateConnection() {
    this.#router.navigate(['/create-connection']);
    }


    deleteConnection(connection: Connection) {
    this.#connectionService.deleteConnection(connection.id).subscribe({
      next: () => {
        this.#connectionService.loadConnections();
        },
        error: (e) => alert('Error al eliminar conexión'),
      });
    }
      
}
