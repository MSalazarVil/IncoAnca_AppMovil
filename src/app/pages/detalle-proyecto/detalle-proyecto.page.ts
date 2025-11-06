import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './detalle-proyecto.page.html',
  styleUrls: ['./detalle-proyecto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})  
export class DetalleProyectoPage implements OnInit, OnDestroy {
  proyectoId: string | null = null;
  proyecto: any;
  nombreUsuario: string = '';
  rol: string = '';
  private routeSub: Subscription | undefined;

  // Datos de ejemplo para simular la obtención de un proyecto
  proyectosActivos = [
    {
      id: '1',
      nombre: 'Puente Río Claro',
      cliente: 'Empresa Tal',
      fechaInicioContrato: '22/10/2025',
      ingenieroResponsable: 'Juan Pérez',
      progreso: 15,
      estado: 'Planificación',
      documentos: [
        { nombre: 'Cronograma', tipo: '.xlsx', subido: '23/10/2025' },
        { nombre: 'Planos Estructurales', tipo: '.pdf', subido: '20/10/2025' },
      ],
      observaciones: [
        { id: 1, texto: 'Curabitur blandit sem turpis, sed laoreet turpis gravida at. Nulla nec ultrices lacus, tempor ullamcorper tellus. Donec consequat efficitur erat sed lobortis.' },
        { id: 2, texto: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin vel ante a orci tempus eleifend.' },
      ]
    },
    {
      id: '2',
      nombre: 'Colegio Estatal N° 1234',
      cliente: 'Gobierno Regional',
      fechaInicioContrato: '15/08/2024',
      ingenieroResponsable: 'María García',
      progreso: 85,
      estado: 'Estudio de Factibilidad',
      documentos: [
        { nombre: 'Estudio de Suelos', tipo: '.pdf', subido: '01/08/2024' },
        { nombre: 'Presupuesto Inicial', tipo: '.docx', subido: '10/08/2024' },
      ],
      observaciones: [
        { id: 3, texto: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' },
      ]
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('DetalleProyectoPage: Constructor llamado');
  }

  ngOnInit() {
    console.log('DetalleProyectoPage: ngOnInit llamado');
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.proyectoId = params.get('id');
      console.log('DetalleProyectoPage: Proyecto ID de la URL (ngOnInit):', this.proyectoId);
      this.loadProyectoDetails();
    });

    this.authService.getUserName().subscribe(name => {
      this.nombreUsuario = name || '';
    });
    this.authService.getUserRole().subscribe(role => {
      this.rol = role || '';
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadProyectoDetails() {
    console.log('DetalleProyectoPage: loadProyectoDetails llamado');
    if (this.proyectoId) {
      this.proyecto = this.proyectosActivos.find(p => p.id === this.proyectoId);
      console.log('DetalleProyectoPage: Proyecto encontrado:', this.proyecto);
      if (!this.proyecto) {
        console.log('DetalleProyectoPage: Proyecto no encontrado, redirigiendo a /home');
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } else {
      console.log('DetalleProyectoPage: No hay proyectoId, redirigiendo a /home');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  goBack() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  subirNuevoDocumento() {
    console.log('Subir nuevo documento para', this.proyecto.nombre);
    // Lógica para subir documento
  }

  actualizarEstadoProyecto() {
    console.log('Actualizar estado del proyecto', this.proyecto.nombre);
    // Lógica para actualizar estado
  }

  levantarObservacion(observacionId: number) {
    console.log('Levantar observación', observacionId, 'para', this.proyecto.nombre);
    // Lógica para levantar observación
  }

  verArchivo(documento: any) {
    console.log('Ver archivo', documento.nombre);
    // Lógica para ver archivo
  }

  actualizarArchivo(documento: any) {
    console.log('Actualizar archivo', documento.nombre);
    // Lógica para actualizar archivo
  }

  get isEmpleado() {
    return this.rol === 'empleado';
  }

  get isCliente() {
    return this.rol === 'cliente';
  }
}