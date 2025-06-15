import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AuthService } from '../../services/auth/auth.service';
import { ConnectionService } from '../../services/connection/connection.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html', 
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private connectionService = inject(ConnectionService);
  private router = inject(Router);

  readonly user = this.authService.getCurrentUser();
  readonly connectionCount = toSignal(this.connectionService.getConnectionsCount(), { initialValue: 0 });

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}