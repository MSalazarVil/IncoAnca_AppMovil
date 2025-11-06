import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService
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

  async loadProyectoDetails() {
    console.log('DetalleProyectoPage: loadProyectoDetails llamado');
    if (this.proyectoId) {
        this.proyecto = await this.firebaseService.getProyectoById(this.proyectoId);
        console.log('DetalleProyectoPage: Proyecto encontrado:', this.proyecto);

        if (this.proyecto) {
          this.proyecto.observaciones = await this.firebaseService.getObservacionesByProyectoId(this.proyectoId);
          console.log('DetalleProyectoPage: Observaciones vinculadas:', this.proyecto.observaciones);
        } else {
          this.proyecto.observaciones = [];
        }

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