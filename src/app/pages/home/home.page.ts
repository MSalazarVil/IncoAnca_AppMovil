import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class HomePage implements OnInit {
  nombreUsuario = "";
  rol = "";
  segmentoSeleccionado: string = "activos";
  proyectosActivos = [
    {
      id: "1",
      nombre: "Puente Río Claro",
      estado: "Planificación",
      progreso: 15,
      ultimaActualizacion: new Date(),
      descripcion: "Desgaste en soportes - peligro en peatones. Debilitamiento estructural de los soportes del puente, perjudicando la seguridad vial. Ejecucion del reforzamiento y soporte para recuperar la estabilidad del puente",
      observaciones: 2,
    },
    {
      id: "2",
      nombre: "Colegio Estatal N° 1234",
      estado: "Estudio de Factibilidad",
      progreso: 85,
      ultimaActualizacion: new Date(),
      descripcion: "Ampliación de la carretera para mejorar el flujo vehicular. Retrasos por condiciones climáticas adversas. Optimizar la logística de materiales para cumplir con los plazos.",
      observaciones: 4,
    },
  ];
  proyectosTerminados = [
    {
      id: "3",
      nombre: "Edificio Administrativo",
      estado: "Finalizado",
      descripcion: "Construcción de un nuevo edificio para oficinas administrativas. Proyecto entregado en tiempo y forma. Satisfacción del cliente con el resultado final.",
    },
    {
      id: "4",
      nombre: "Parque Urbano Central",
      estado: "Finalizado",
      descripcion: "Diseño y construcción de un parque recreativo en el centro de la ciudad. Gran afluencia de público desde su inauguración. Contribución significativa al espacio público.",
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUserName().subscribe((name) => {
      this.nombreUsuario = name || "";
    });
    this.authService.getUserRole().subscribe((role) => {
      this.rol = role || "";
    });
    console.log("HomePage ngOnInit called");
  }

  navigateAndBlur(path: string | any[]) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (Array.isArray(path)) {
      this.router.navigate(path, { replaceUrl: true });
    } else {
      this.router.navigateByUrl(path, { replaceUrl: true });
    }
  }

  cerrarSesion() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.authService.logout();
    this.router.navigateByUrl("/login", { replaceUrl: true });
  }

  get isEmpleado() {
    return this.rol === "empleado";
  }
  get isCliente() {
    return this.rol === "cliente";
  }
}
