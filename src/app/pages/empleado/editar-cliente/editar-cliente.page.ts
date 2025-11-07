import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.page.html',
  styleUrls: ['./editar-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditarClientePage implements OnInit {
  id = '';
  form: any = {
    nombre: '',
    email: '',
    username: '',
    empresaAsociada: ''
  };
  cargando = false;
  guardando = false;
  empresas: any[] = [];
  cargandoEmpresas = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (!this.id) {
      this.router.navigate(['/clientes']);
      return;
    }
    this.cargando = true;
    try {
      const u = await this.firebase.getUserById(this.id);
      if (u) {
        this.form.nombre = u.nombre || '';
        this.form.email = u.email || '';
        this.form.username = u.username || '';
        const pathOrId = u.empresaAsociada || '';
        this.form.empresaAsociada = pathOrId
          ? (pathOrId.includes('/') ? pathOrId.split('/').filter(Boolean)[1] : pathOrId)
          : '';
      }
    } finally {
      this.cargando = false;
    }

    // Cargar lista de empresas para mostrar el nombre en el selector
    this.cargandoEmpresas = true;
    try {
      this.empresas = await this.firebase.listEmpresas();
    } finally {
      this.cargandoEmpresas = false;
    }
  }

  async guardar() {
    if (!this.id) return;
    this.guardando = true;
    const payload: any = {};
    if (this.form.nombre !== undefined) payload.nombre = this.form.nombre;
    if (this.form.email !== undefined) payload.email = this.form.email;
    if (this.form.username !== undefined) payload.username = this.form.username;
    if (this.form.empresaAsociada !== undefined) payload.empresaAsociada = this.form.empresaAsociada;
    try {
      const ok = await this.firebase.updateUser(this.id, payload);
      await this.toast((ok ? 'Cambios guardados' : 'No se pudo guardar'));
      if (ok) this.router.navigate(['/clientes']);
    } finally {
      this.guardando = false;
    }
  }

  private async toast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
