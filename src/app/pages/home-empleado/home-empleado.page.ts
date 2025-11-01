import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-empleado',
  templateUrl: './home-empleado.page.html',
  styleUrls: ['./home-empleado.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomeEmpleadoPage implements OnInit {
  nombre = '';

  ngOnInit() {
    // Recuperamos el nombre del usuario almacenado en localStorage (desde el login)
    const nombre = localStorage.getItem('nombre');
    this.nombre = nombre ? nombre : 'Empleado';
  }

  abrirPerfil() {
    // Más adelante redirigirá al perfil del usuario
    console.log('Abrir perfil de usuario');
  }
}
