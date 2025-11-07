import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  nombre = '';
  rol = '';
  email = '';
  cargo = '';
  telefono = '';
  usuario = '';
  empresa: any = null;

  constructor(private router: Router, private firebase: FirebaseService, private authService: AuthService) { }

  ngOnInit() {
    this.nombre = this.authService.getNameSnapshot() ?? '';
    this.rol = this.authService.getRoleSnapshot() ?? '';
    this.email = this.authService.getEmailSnapshot() ?? '';
    this.cargo = this.authService.getCargoSnapshot() ?? '';
    this.telefono = this.authService.getTelefonoSnapshot() ?? '';
    this.usuario = this.authService.getUsuarioSnapshot() ?? '';
    const userId = this.authService.getUserIdSnapshot();

    if (this.rol === 'cliente' && userId) {
      // Buscar empresa asociada al usuario en Firestore
      const empresaRef = localStorage.getItem('empresaAsociada') || '';
      if (empresaRef) {
        this.firebase.getEmpresaPorPath(empresaRef)
          .then(emp => this.empresa = emp)
          .catch(() => this.empresa = null);
      } else {
        this.firebase.getEmpresaPorRepresentante(userId)
          .then(emp => this.empresa = emp)
          .catch(() => this.empresa = null);
      }
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToEditProfile() {
    this.router.navigate(['/perfil/crud-perfil']);
  }
}

