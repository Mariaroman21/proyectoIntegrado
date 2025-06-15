import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, catchError, throwError } from 'rxjs';
import { Connection } from '../../interfaces/connection.interface';
import { Couple } from '../../interfaces/couple.interface';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  #connectionsSignal = signal<Connection[]>([]);
  #connections = computed(()=> 
    this.#connectionsSignal());


  #couple = signal<Couple|null>(null);

  readonly #apiUrl = 'http://localhost:8000/api';
  readonly #http = inject(HttpClient);

  loadConnections(): Observable<Connection[]> {
    return this.#http.get<Connection[]>(`${this.#apiUrl}/connections`).pipe(
      tap(data => this.#connectionsSignal.set(data)),
      catchError(error => {
        console.error('Error cargando conexiones', error);
        return throwError(() => error);
      })
    );
  }

  getConnections(): Signal<Connection[]> {
    return this.#connectionsSignal.asReadonly();
  }
  
  deleteConnection(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/connections/${id}`).pipe(
      tap(() => {
        this.#connectionsSignal.update(conns => conns.filter(c => c.id !== id));
      }),
      catchError(error => {
        console.error('Error eliminando conexión', error);
        return throwError(() => error);
      })
    );
  }


  getConnectionsCount() {
    return this.#http.get<{count: number}>(`${this.#apiUrl}/connections/count`).pipe(
      map(response => response.count)
    );
  }

  createConnection(data: any): Observable<any> {
    return this.#http.post(`${this.#apiUrl}/new`, data);
  }


  getCoupleData(connectionId: string): Observable<Couple> {
    return this.#http.get<Couple>(`${this.#apiUrl}/connections/couples/${connectionId}`);
  }

  getConnectionById(id: string) {
    return this.#http.get<Couple>(`${this.#apiUrl}/connections/couples/${id}`);
  }
  
  updateConnection(id: string, data: any) {
    return this.#http.put(`${this.#apiUrl}/connections/couples/${id}`, data);
  }


}

  

