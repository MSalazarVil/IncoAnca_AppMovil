import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class HomePage implements OnInit {
  nombre = '';
  rol = '';
  segment = 'activos';
  buscar = '';
  activos: any[] = [];
  terminados: any[] = [];

  constructor(private router: Router, private firebase: FirebaseService) {}

  ngOnInit() {
    const nombre = localStorage.getItem('nombre');
    this.nombre = nombre ? nombre : 'Empleado';

    const rol = localStorage.getItem('rol');
    this.rol = rol ? rol : 'empleado';

    this.cargarProyectos();
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

  private etapaCompleta(estado: any) {
    return String(estado || '').toLowerCase() === 'completo';
  }

  // Progreso: 25% por etapa con estado 'completo'. Estado mostrado: estadoActual del proyecto.
  private calcularProgreso(p: any) {
    const etapas = p?.etapas || {};
    const keys = Object.keys(etapas);
    const totalEtapas = 4;
    if (!keys.length) return 0;
    let completas = 0;
    keys.forEach(k => {
      const e = etapas[k];
      if (this.etapaCompleta(e?.estado)) completas += 1;
    });
    if (completas > totalEtapas) completas = totalEtapas;
    return completas * (1 / totalEtapas);
  }

  private mapProyectoToCard(p: any) {
    const progreso = this.calcularProgreso(p);
    const estadoActual = (p?.estadoActual || '').toString();
    return {
      id: p.id,
      titulo: p?.nombre || 'Proyecto',
      estado: estadoActual ? estadoActual.charAt(0).toUpperCase() + estadoActual.slice(1) : 'En proceso',
      progreso,
      obs: p?.observacionesCount || 0,
      empresaAsociada: p?.empresaAsociada || ''
    };
  }

  private async cargarProyectos() {
    try {
      const empresaId = localStorage.getItem('empresaAsociada') || '';
      let proyectos: any[] = [];
      if (this.rol === 'cliente' && empresaId) {
        proyectos = await this.firebase.listProyectosPorEmpresa(empresaId);
      } else {
        proyectos = await this.firebase.listProyectos();
      }

      const cards = proyectos.map(p => this.mapProyectoToCard(p));
      const esTerminado = (c: any) => c.progreso >= 1;
      this.terminados = cards.filter(esTerminado);
      this.activos = cards.filter(c => !esTerminado(c));
    } catch {
      this.activos = [];
      this.terminados = [];
    }
  }
}
