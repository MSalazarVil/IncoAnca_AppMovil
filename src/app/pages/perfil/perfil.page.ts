import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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

  constructor(private router: Router) { }

  ngOnInit() {
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');
    this.nombre = nombre ? nombre : '';
    this.rol = rol ? rol : '';
  }

  cerrarSesion() {
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }

}
