import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Connection } from '../../interfaces/connection.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  readonly #apiUrl = 'http://localhost:8000/api';
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);

  token = signal<string | null>(localStorage.getItem('token'));
  isAuthenticated = signal(!!this.token());
  currentUser = signal<any>(null);

  login(username: string, password: string) {
    return this.#http.post<{ token: string }>(`${this.#apiUrl}/login`, { username, password });
  }

  register(data: any) {
    return this.#http.post<{ token: string }>(`${this.#apiUrl}/register`, data, { withCredentials: true });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.token.set(token);
    this.isAuthenticated.set(true);
    this.loadAuthenticatedUser();
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.#router.navigate(['/login']);
  }

  loadAuthenticatedUser() {
    this.#http.get<User>(`${this.#apiUrl}/user`).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => this.logout() 
    });
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }
}