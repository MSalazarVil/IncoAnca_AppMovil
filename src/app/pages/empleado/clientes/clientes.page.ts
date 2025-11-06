import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ClientesPage implements OnInit {
  cargando = true;
  clientes: any[] = [];

  constructor(private fb: FirebaseService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.cargando = true;
    const lista = await this.fb.listarClientes();
    // Enriquecer con empresa: usa empresaAsociada (id o ruta) o busca por representante
    this.clientes = await Promise.all(lista.map(async (c: any) => {
      let empresa = null;
      if (c.empresaAsociada) {
        empresa = await this.fb.getEmpresaPorPath(c.empresaAsociada);
      }
      if (!empresa) {
        empresa = await this.fb.getEmpresaPorRepresentante(c.id);
      }
      return { ...c, empresa };
    }));
    this.cargando = false;
  }
}
