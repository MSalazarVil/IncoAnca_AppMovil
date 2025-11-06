import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ClientesPage implements OnInit {
  clientes: any[] = [];
  expanded: Record<string, boolean> = {};
  empresas: Record<string, any> = {};
  loadingEmpresa: Record<string, boolean> = {};

  constructor(private firebase: FirebaseService) { }

  ngOnInit() {
    this.cargarClientes();
  }

  async cargarClientes() {
    try {
      this.clientes = await this.firebase.listClientes();
    } catch (e) {
      this.clientes = [];
    }
  }

  async toggleCliente(cliente: any) {
    const id = cliente?.id;
    if (!id) { return; }
    this.expanded[id] = !this.expanded[id];
    if (this.expanded[id] && !this.empresas[id] && !this.loadingEmpresa[id]) {
      this.loadingEmpresa[id] = true;
      try {
        this.empresas[id] = await this.firebase.getEmpresaDeCliente(cliente);
      } finally {
        this.loadingEmpresa[id] = false;
      }
    }
  }

}
