import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';

interface UserResponse {
  username?: string;
  password?: string;
  rol?: string;
  nombre?: string;
  error?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})

export class LoginPage {
  usuario = '';
  contrasena = '';
  errorUsuario = '';
  errorContrasena = '';

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  async login() {
    // Limpiar errores anteriores
    this.errorUsuario = '';
    this.errorContrasena = '';

    // Validar campos vacíos antes de consultar al Firestore
    if (!this.usuario.trim() || !this.contrasena.trim()) {
      if (!this.usuario.trim()) {
        this.errorUsuario = 'Ingrese su usuario';
      }
      if (!this.contrasena.trim()) {
        this.errorContrasena = 'Ingrese su contraseña';
      }
      return;
    }

    const user: UserResponse = await this.firebaseService.login(this.usuario, this.contrasena);

    if (user['error'] === 'usuario_no_encontrado') {
      this.errorUsuario = 'Usuario no encontrado';
      this.usuario = ''; 
      this.contrasena = ''; 
    } else if (user['error'] === 'contrasena_incorrecta') {
      this.errorContrasena = 'Contraseña incorrecta';
      this.contrasena = ''; 
    } else if (user.rol === 'empleado') {
      localStorage.setItem('nombre', user['nombre'] || this.usuario);
      this.router.navigate(['/home']);
    } else if (user.rol === 'cliente') {
      localStorage.setItem('nombre', user['nombre'] || this.usuario);
      this.router.navigate(['/home']);
    } else {
      alert('Rol de usuario no reconocido');
    }
  }
}