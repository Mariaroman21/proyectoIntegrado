import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', 
    loadChildren: () => import('./features/pages/auth/auth.module').then(m => m.AuthModule) },
  
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  
  {
    path: 'home',
    loadComponent: () =>
      import('./features/pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },

  {
    path: 'connections/:id/couple',
    loadComponent: () =>
      import('./features/pages/connection/couple-detail/connection-couple-detail.component').then(m => m.ConnectionCoupleDetailComponent),
    canActivate: [authGuard],
  },

    
  {
    path: 'connections/:id/couple/update',
    loadComponent: () =>
      import('./features/pages/connection/connection-couple-update/connection-couple-update.component').then(m => m.ConnectionCoupleUpdateComponent),
    canActivate: [authGuard],
  },
  

  {
    path: 'create-connection',
    loadComponent: () =>
    import('./features/pages/connection/connection-new/connection-new.component').then((m) => m.ConnectionNewComponent),
    canActivate: [authGuard]
  },





  

  { path: '**', redirectTo: 'auth/login' },

];
