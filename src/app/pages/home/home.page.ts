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

  // Determina el estado visible (etapa actual) y el progreso: 25% por etapa
  private calcularEstadoYProgreso(p: any) {
    const etapas = p?.etapas || {};
    const stages = [
      { key: 'perfil', label: 'Perfil' },
      { key: 'evaluacionPerfil', label: 'Evaluacion de Perfil' },
      { key: 'etapa3', label: 'Etapa 3' },
      { key: 'etapa4', label: 'Etapa 4' },
    ];
    const total = stages.length;
    const firstPendingIndex = stages.findIndex(s => !this.etapaCompleta(etapas?.[s.key]?.estado));
    if (firstPendingIndex === -1) {
      return { estado: 'Finalizado', progreso: 1 };
    }
    const progreso = firstPendingIndex / total; // 0, .25, .5, .75
    const estado = stages[firstPendingIndex]?.label || 'En proceso';
    return { estado, progreso };
  }

  private mapProyectoToCard(p: any) {
    const { estado, progreso } = this.calcularEstadoYProgreso(p);
    return {
      id: p.id,
      titulo: p?.nombre || 'Proyecto',
      estado,
      progreso,
      obs: p?.observacionesCount || 0,
      empresaAsociada: p?.empresaAsociada || ''
    };
  }

  private getEstadoActual(p: any) {
    const etapas = p?.etapas || {};
    const orden = [
      { key: 'perfil', label: 'Perfil' },
      { key: 'evaluacionPerfil', label: 'Evaluación de Perfil' },
      { key: 'estudioFactibilidad', label: 'Estudio de Factibilidad' },
      { key: 'declaracionViabilidad', label: 'Declaración de Viabilidad' },
    ];

    // 1) Preferir la etapa que esté "en proceso"
    for (const it of orden) {
      const e = etapas?.[it.key];
      const estado = (e?.estado || '').toString().toLowerCase();
      if (estado === 'en proceso') return e?.nombreEtapa || it.label;
    }

    // 2) Si todas están completas, mostrar "Terminado"
    const allComplete = orden.every(it => this.etapaCompleta(etapas?.[it.key]?.estado));
    if (allComplete) return 'Terminado';

    // 3) En otro caso, mostrar la próxima pendiente (no completa)
    for (const it of orden) {
      const e = etapas?.[it.key];
      if (!this.etapaCompleta(e?.estado)) return e?.nombreEtapa || it.label;
    }

    // 4) Fallback
    return 'En proceso';
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

