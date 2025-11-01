import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home-empleado',
    loadComponent: () => import('./pages/home-empleado/home-empleado.page').then( m => m.HomeEmpleadoPage)
  },
  {
    path: 'home-cliente',
    loadComponent: () => import('./pages/home-cliente/home-cliente.page').then( m => m.HomeClientePage)
  }
];
