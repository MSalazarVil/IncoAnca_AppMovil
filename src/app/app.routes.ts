import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

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
    path: 'home',
    loadComponent: () => Promise.resolve(HomePage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
  },
  {
    path: 'add-cliente',
    loadComponent: () => import('./pages/empleado/add-cliente/add-cliente.page').then(m => m.AddClientePage)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/empleado/clientes/clientes.page').then(m => m.ClientesPage)
  },
  {
    path: 'editar-cliente/:id',
<<<<<<< HEAD
    loadComponent: () => import('./pages/empleado/editar-cliente/editar-cliente.page').then(m => m.EditarClientePage)
  },
  {
    path: 'proyecto',
    loadComponent: () => import('./pages/empleado/proyecto/proyecto.page').then(m => m.ProyectoPage)
=======
    loadComponent: () => import('./pages/empleado/editar-cliente/editar-cliente.page').then( m => m.EditarClientePage)
>>>>>>> parent of f4e9f80 (Nueva carpeta - empleado/proyecto)
  }
];

