import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})

export class HomePage implements OnInit {
  nombre = '';

  ngOnInit() {
    // Recuperamos el nombre del usuario almacenado en localStorage (desde el login)
    const nombre = localStorage.getItem('nombre');
    this.nombre = nombre ? nombre : 'Empleado';
  }

  abrirPerfil() {
    console.log('Abrir perfil de usuario');
  }
}
