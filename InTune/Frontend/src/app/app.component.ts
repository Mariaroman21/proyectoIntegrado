import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { AuthService } from './shared/services/auth/auth.service';
import { effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
  <div class="min-h-screen bg-pink-50 px-6"> 
    <app-header *ngIf="isAuthenticated()" />
    <router-outlet></router-outlet>
</div>
  `,
})
export class AppComponent {
  title = 'Frontend';
  #authService = inject(AuthService);
  isAuthenticated = this.#authService.isAuthenticated;

  constructor() {
    effect(() => {
      if (this.#authService.token()) {
        this.#authService.loadAuthenticatedUser();
      }
    });
  }
}
