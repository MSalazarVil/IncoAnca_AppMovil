import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.page.html',
  styleUrls: ['./add-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddClientePage implements OnInit {
  form: any = {
    nombre: '',
    email: '',
    username: '',
    password: '',
    empresaAsociada: '' // opcional (id)
  };

  crearEmpresa = false;
  empresa: any = {
    razonSocial: '',
    ruc: '',
    direccion: '',
    telefono: '',
    tipoEntidad: ''
  };

  guardando = false;
  empresas: any[] = [];
  cargandoEmpresas = false;

  constructor(private firebase: FirebaseService, private router: Router, private toastCtrl: ToastController) { }

  async ngOnInit() {
    // Cargar lista de empresas para el desplegable
    this.cargandoEmpresas = true;
    try {
      this.empresas = await this.firebase.listEmpresas();
    } finally {
      this.cargandoEmpresas = false;
    }
  }

  private async toast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 1800, position: 'bottom' });
    await t.present();
  }

  validoUsuario(): boolean {
    return !!(this.form.nombre && this.form.email && this.form.username && this.form.password);
  }

  validoEmpresa(): boolean {
    if (!this.crearEmpresa) return true;
    return !!(this.empresa.razonSocial && this.empresa.ruc);
  }

  async guardar() {
    if (!this.validoUsuario()) {
      await this.toast('Complete los campos del cliente');
      return;
    }
    if (!this.validoEmpresa()) {
      await this.toast('Complete al menos Razón social y RUC');
      return;
    }
    this.guardando = true;
    try {
      const cliente = await this.firebase.createCliente({
        nombre: this.form.nombre,
        email: this.form.email,
        username: this.form.username,
        password: this.form.password,
        empresaAsociada: this.crearEmpresa ? undefined : (this.form.empresaAsociada || undefined)
      });

      if (this.crearEmpresa && cliente?.id) {
        await this.firebase.createEmpresaAsociadaForCliente(cliente.id, {
          razonSocial: this.empresa.razonSocial,
          ruc: this.empresa.ruc,
          direccion: this.empresa.direccion || undefined,
          telefono: this.empresa.telefono || undefined,
          tipoEntidad: this.empresa.tipoEntidad || undefined
        });
      }

      await this.toast('Cliente creado');
      this.router.navigate(['/clientes']);
    } catch (e) {
      await this.toast('No se pudo crear el cliente');
    } finally {
      this.guardando = false;
    }
  }

}
