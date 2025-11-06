import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})

export class HomePage implements OnInit {
  nombre = '';
  rol = '';
  segment = 'activos';
  buscar = '';
  activos = [
    { titulo: 'Puente Rio Claro', estado: 'Planificacion', progreso: 0.25, obs: 2 },
    { titulo: 'Puente Rio Claro', estado: 'Planificacion', progreso: 0.25, obs: 2 },
  ];
  terminados = [
    { titulo: 'Edificio Administrativo', estado: 'Finalizado' },
    { titulo: 'Carretera Principal Tramo A', estado: 'Finalizado' },
  ];
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Recuperamos el nombre del usuario almacenado en localStorage (desde el login)
    const nombre = localStorage.getItem('nombre');
    this.nombre = nombre ? nombre : 'Empleado';

    // Recuperamos el rol del usuario (empleado | cliente)
    const rol = localStorage.getItem('rol');
    this.rol = rol ? rol : 'empleado';
  }

  abrirPerfil() {
    this.router.navigate(['/perfil']);
  }

  get isEmpleado() { return this.rol === 'empleado'; }
  get isCliente() { return this.rol === 'cliente'; }
  get primerNombre() {
    const n = (this.nombre || '').trim();
    if (!n) { return ''; }
    const parts = n.split(/\s+/);
    return parts[0] || n;
  }
}


