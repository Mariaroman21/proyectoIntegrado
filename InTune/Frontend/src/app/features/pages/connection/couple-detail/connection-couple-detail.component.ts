  import { Component, inject } from '@angular/core';
  import { ConnectionService } from '../../../../shared/services/connection/connection.service';
  import { ActivatedRoute, RouterLink } from '@angular/router';
  import { map } from 'rxjs/operators';
  import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
  
  @Component({
    selector: 'app-connection-couple-detail',
    imports:[CommonModule, RouterLink],
    templateUrl: './connection-couple-detail.component.html',
  })
  export class ConnectionCoupleDetailComponent {
    readonly #connectionService = inject(ConnectionService);
    readonly #route = inject(ActivatedRoute);
  
    readonly connectionId = this.#route.snapshot.paramMap.get('id')!;
  
    couple: Observable<any> = this.#connectionService.getCoupleData(this.connectionId).pipe(
      map(data => ({
        ...data,
        frase_bonita: this.getRandomFraseBonita()
      }))
    );
  
    getRandomFraseBonita(): string {
      const frases = [
        'Eres mi sol en días nublados',
        'Siempre tú',
        'Nuestro amor es mi historia favorita',
        'Juntos es mejor',
        'Tú y yo, para siempre',
        'Mi lugar favorito es a tu lado',
      ];
      return frases[Math.floor(Math.random() * frases.length)];
    }
  }
  