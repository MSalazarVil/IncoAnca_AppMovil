import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

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
  empresa: any = null;
  user: any = null;

  constructor(private router: Router, private firebase: FirebaseService) { }

  async ngOnInit() {
    const userId = localStorage.getItem('userId') || '';

    // cargar datos del usuario desde firabase
    if (userId) {
      try {
        const perfil = await this.firebase.getPerfilCompleto(userId);
        if (perfil?.user) {
          this.user = perfil.user;
          
          try {
            const ca: any = (this.user as any)?.createdAt;
            if (ca && typeof ca.toDate === 'function') {
              this.user.createdAt = ca.toDate().toLocaleString();
            }
          } catch {}
          this.nombre = perfil.user?.nombre || localStorage.getItem('nombre') || '';
          this.rol = perfil.user?.rol || localStorage.getItem('rol') || '';
          this.empresa = perfil.empresa || null;
        } else {
          this.nombre = localStorage.getItem('nombre') || '';
          this.rol = localStorage.getItem('rol') || '';
        }
      } catch {
        this.nombre = localStorage.getItem('nombre') || '';
        this.rol = localStorage.getItem('rol') || '';
        this.empresa = null;
      }
    } else {
      this.nombre = localStorage.getItem('nombre') || '';
      this.rol = localStorage.getItem('rol') || '';
    }
  }

  cerrarSesion() {
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    localStorage.removeItem('empresaAsociada');
    this.router.navigate(['/login']);
  }
}
