import { Component, inject, signal } from '@angular/core';
import { ConnectionService } from '../../../shared/services/connection/connection.service';
import { ConnectionListComponent } from '../../components/connection-list/connection-list.component';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [ConnectionListComponent],
  template: `
    <div class="min-h-screen bg-pink-50 pt-4"> 
      <div class="container mx-auto px-4"> 
        <app-connection-list [connections]="connections()" class="mt-0"/> 
      </div>
    </div>
  `,
})
export class HomeComponent {
  readonly #connectionService = inject(ConnectionService);
  readonly connections = this.#connectionService.getConnections();

  connectionsResource= rxResource({ 
    loader:()=> this.#connectionService.loadConnections()
   });
  
}
