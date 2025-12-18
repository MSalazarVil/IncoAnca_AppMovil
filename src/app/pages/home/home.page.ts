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
  modalProyectoAbierto = false;
  guardandoProyecto = false;
  cargandoOpciones = false;
  errorProyecto = '';
  empresas: any[] = [];
  clientes: any[] = [];
  formProyecto: any = {
    nombre: '',
    descripcion: '',
    empresaAsociada: '',
    clienteAsociado: ''
  };

  constructor(private router: Router, private firebase: FirebaseService) {}

  ngOnInit() {
    const nombre = localStorage.getItem('nombre');
    this.nombre = nombre ? nombre : 'Empleado';

    const rol = localStorage.getItem('rol');
    this.rol = rol ? rol : 'empleado';

    this.cargarProyectos();
    this.cargarOpcionesProyecto();
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

  private calcularProgreso(p: any) {
    const estadoActual = (p?.estadoActual || '').toString();
    const keyEstado = estadoActual.replace(/\s+/g, '').toLowerCase();
    const map: Record<string, number> = {
      perfil: 0.2,
      evaluacionperfil: 0.5,
      estudiofactibilidad: 0.75,
      declaracionviabilidad: 1,
    };

    const progresoEstado = map[keyEstado] ?? 0;
    if (progresoEstado) return progresoEstado > 1 ? 1 : progresoEstado;

    // Fallback: usa el estado de etapas si no hay coincidencia con estadoActual
    const etapas = p?.etapas || {};
    const orden = [
      { key: 'perfil', progreso: 0.2 },
      { key: 'evaluacionPerfil', progreso: 0.5 },
      { key: 'estudioFactibilidad', progreso: 0.75 },
      { key: 'declaracionViabilidad', progreso: 1 },
    ];
    let progreso = 0;
    for (const it of orden) {
      const estado = (etapas?.[it.key]?.estado || '').toString().toLowerCase();
      if (estado === 'en proceso') { progreso = it.progreso; break; }
      if (estado === 'completo' || estado === 'completado') { progreso = it.progreso; continue; }
      break;
    }
    return progreso > 1 ? 1 : progreso;
  }

  private mapProyectoToCard(p: any) {
    const progreso = this.calcularProgreso(p);
    return {
      id: p.id,
      titulo: p?.nombre || 'Proyecto',
      estado: this.getNombreEtapaActual(p),
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

    for (const it of orden) {
      const e = etapas?.[it.key];
      const estado = (e?.estado || '').toString().toLowerCase();
      if (estado === 'en proceso') return e?.nombreEtapa || it.label;
    }

    const allComplete = orden.every(it => this.etapaCompleta(etapas?.[it.key]?.estado));
    if (allComplete) return 'Terminado';

    for (const it of orden) {
      const e = etapas?.[it.key];
      if (!this.etapaCompleta(e?.estado)) return e?.nombreEtapa || it.label;
    }

    return 'En proceso';
  }

  private getNombreEtapaActual(p: any) {
    const etapas = p?.etapas || {};
    const estadoActual = (p?.estadoActual || '').toString();
    const keyEstado = estadoActual.replace(/\s+/g, '').toLowerCase();
    const mapKeyToEtapa: Record<string, string> = {
      perfil: 'perfil',
      evaluacionperfil: 'evaluacionPerfil',
      estudiofactibilidad: 'estudioFactibilidad',
      declaracionviabilidad: 'declaracionViabilidad',
    };
    const etapaKey = mapKeyToEtapa[keyEstado];

    if (etapaKey && etapas?.[etapaKey]) {
      return etapas[etapaKey].nombreEtapa || estadoActual || 'En proceso';
    }

    const orden = [
      { key: 'perfil', label: 'Perfil' },
      { key: 'evaluacionPerfil', label: 'Evaluacion de Perfil' },
      { key: 'estudioFactibilidad', label: 'Estudio de Factibilidad' },
      { key: 'declaracionViabilidad', label: 'Declaracion de Viabilidad' },
    ];

    for (const it of orden) {
      const e = etapas?.[it.key];
      const estado = (e?.estado || '').toString().toLowerCase();
      if (estado === 'en proceso') return e?.nombreEtapa || it.label;
      if (estado !== 'completo' && estado !== 'completado') return e?.nombreEtapa || it.label;
    }

    return estadoActual || 'En proceso';
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

  get clientesFiltrados() {
    const emp = this.formProyecto.empresaAsociada;
    if (!emp) return this.clientes;
    return this.clientes.filter(c => {
      const asociada = c?.empresaAsociada || '';
      if (!asociada) return false;
      if (asociada === emp) return true;
      return asociada.endsWith(`/${emp}`);
    });
  }

  async cargarOpcionesProyecto() {
    this.cargandoOpciones = true;
    try {
      this.empresas = await this.firebase.listEmpresas();
      this.clientes = await this.firebase.listClientes();
    } catch {
      this.empresas = [];
      this.clientes = [];
    } finally {
      this.cargandoOpciones = false;
    }
  }

  abrirModalProyecto() {
    this.errorProyecto = '';
    this.modalProyectoAbierto = true;
  }

  cerrarModalProyecto() {
    this.modalProyectoAbierto = false;
    this.errorProyecto = '';
    this.guardandoProyecto = false;
    this.formProyecto = { nombre: '', descripcion: '', empresaAsociada: '', clienteAsociado: '' };
  }

  private validoProyecto() {
    return !!(this.formProyecto.nombre && this.formProyecto.empresaAsociada && this.formProyecto.clienteAsociado);
  }

  async guardarProyecto() {
    if (!this.validoProyecto()) {
      this.errorProyecto = 'Completa nombre, empresa y cliente';
      return;
    }
    this.guardandoProyecto = true;
    this.errorProyecto = '';
    try {
      await this.firebase.createProyecto({
        nombre: this.formProyecto.nombre.trim(),
        descripcion: (this.formProyecto.descripcion || '').trim(),
        empresaAsociada: this.formProyecto.empresaAsociada,
        clienteAsociado: this.formProyecto.clienteAsociado
      });
      this.cerrarModalProyecto();
      await this.cargarProyectos();
    } catch {
      this.errorProyecto = 'No se pudo crear el proyecto';
    } finally {
      this.guardandoProyecto = false;
    }
  }
}
